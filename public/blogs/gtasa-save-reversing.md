# Understanding Binary/File Format Reverse Engineering

Hi, let's understand binary/file format reverse engineering. We'll try to manipulate a game "save file" of GTA: San Andreas using its inbuilt mechanism. Let's assume we have to set the total number of sprayed tags from the number "5" to "100".

We recommend you be familiar with these topics:

- Programming Fundamentals
- Binary Basics
- Pattern Recognition in Data
- File Handling & Structure Thinking
- Offsets, Hex, and Structure (Optional)

## To Achieve This Result, We Have a Few Python Files

1. **`gtasa_save_core.py`** — *the foundation.* Scans the whole file for every spot where the literal text `BLOCK` appears, reads the 4-byte number right after it (the box's size), and builds a table of every box: where it starts, how big it is, and where it ends. Also has the checksum math built in, so every other script can reuse it. *(Finds and maps all the "data boxes" inside the save file so we know where everything lives.)*

2. **`verify_block20.py`** — *the wide net.* Walks through every `BLOCK` box in the file and checks the number after each one. Flags any box where that number is exactly 100, since there are 100 tags. This is what found our one candidate box at `0x02A4A0`. *(Searches all those boxes to find one that likely stores the 100 tags.)*

3. **`verify_tag_candidate.py`** — *the close-up.* Zooms in on just that one candidate box, prints all 100 bytes with their index numbers, and lists which ones are flagged "done." Read-only — never writes anything. *(Inspects that specific box in detail to confirm it really contains the tag progress.)*

4. **`patch_tag_candidate.py`** — *the actual editor.* The only script that changes anything. Re-checks that the box is really there and the right size, flips all 100 bytes to "done," recalculates the checksum, and saves the result as a new file — leaving the original untouched. *(Edits the save file to mark all 100 tags as completed without breaking the file.)*

5. **`gtasa_save_diff.py`** — *comparison tool.* A first-draft "compare two saves" script. Lines up two files byte by byte and reports where they differ. *(Compares two save files to show exactly what changed.)*

Now we will do a breakdown of these files.

---

## `gtasa_save_core.py`

**`parse_sections()`** — Since the binary data mostly consists of numeric data (`0101010011` or `0x02A...`) divided into chunks or blocks, this particular section marks the starting and ending point of each block, its size, and finally maps out the whole structure.

**`find_all_block_tags()` + `collapse_tiling_runs()`** — This section is what we can call a filter. It separates the block strings from unnecessary data (things we should not touch).

**`compute_checksum()` + `verify_checksum()`** — Remember, we are changing the inbuilt elements of the game. It is similar to turning a switch ON and OFF. If the file even adds or subtracts a byte, it will result in corruption. This particular section of code confirms file integrity.

---

## `verify_block20.py`

**`find_all_block_occurrences()` + Candidate Detection (`uint32 == 100`)** — After we have successfully mapped out the structure, we need to find the exact block that contains 100 collectable items. This file scans raw bytes and finds every place the word "BLOCK" exists in the file, checks if it equals 100, and flags it as a possible tag structure.

**Byte Inspection** — Shows patterns by counting values like `0x00`, `0x01`, `0xFF`, etc.

![Raw hex dump showing BLOCK tags inside the save file](/blogs/img/gtasa-save-reversing/image2.png)

---

## `patch_tag_candidate.py`

It does three things: a validation block, patch logic (the actual edit), and checksum recalculation.

**How?**

First, it confirms three things: that "BLOCK" exists at the expected offset, that the size is exactly 100, and that the region ends exactly where the next block starts.

After that comes a very critical step — patch logic. It marks all 100 tags as collected by setting all 100 bytes to `0xFF` (`0xFF` basically means collected — you have turned the switch ON).

Finally, checksum recalculation: it recalculates the checksum (sum of bytes % 2³²) and rewrites the last 4 bytes. This updates the file's integrity value so the game doesn't reject it as corrupted.

---

## `verify_tag_candidate.py`

A function from this file:

```python
if tag_bytes != b"BLOCK":
    print(f"ABORT: Expected b'BLOCK' at 0x{CANDIDATE_OFFSET:06X}, found {tag_bytes!r}.")
    print("The candidate offset no longer matches what was previously "
          "observed in GTASAsf9.b. This script will not proceed on a "
          "stale assumption. If you're running this against a "
          "DIFFERENT save file, this offset is not expected to be valid "
          "for it -- re-run the broader scan (verify_block20.py) first.")
    sys.exit(1)

declared_len = struct.unpack_from("<I", data, CANDIDATE_OFFSET + 5)[0]
if declared_len != 100:
    print(f"ABORT: Expected declared length 100 at 0x{CANDIDATE_OFFSET+5:06X}, "
          f"found {declared_len}.")
    sys.exit(1)

region_start = CANDIDATE_OFFSET + HEADER_LEN
region_end = region_start + REGION_LEN
region = data[region_start:region_end]

# Structural corroboration: does the next BLOCK tag begin EXACTLY where
# this region ends, with zero slack? (Observed previously -- re-checked
# here, not assumed.)
next_tag = data[region_end:region_end + 5]
aligned = (next_tag == b"BLOCK")

print(f"Candidate header validated at 0x{CANDIDATE_OFFSET:06X}: "
      f"b'BLOCK' + uint32(100)  -> region 0x{region_start:06X}-0x{region_end-1:06X}")
print(f"Next 5 bytes after region end (0x{region_end:06X}): {next_tag!r}  "
      f"{'(matches BLOCK -- zero slack, exact boundary)' if aligned else '(does NOT match BLOCK -- unexpected slack)'}\n")
```

This section ensures that the script is operating on a correct and verified structure, rather than blindly trusting a hardcoded offset.

**Re-validation steps:**
- Checks that "BLOCK" exists at `0x02A4A0`
- Confirms the size is still 100
- Verifies the next block starts exactly after

**`0xFF` detection:**
- Finds all bytes equal to `0xFF`
- Counts them
- Highlights anomalies
- Compares the `0xFF` count vs. the actual in-game stat

![Raw strings dump showing cutscene/mission tags embedded in the save file](/blogs/img/gtasa-save-reversing/image3.png)

---

## `gtasa_save_diff.py`

**`diff_bytes()`** — Compares two files byte by byte (the original and the modified one).

**`group_into_runs()`** — Shows where the change happened, tells which section it belongs to, and detects if it's a single-bit change (very important for flags/collectibles).

That's it!

Here's the proof it worked — the in-game Stats menu after loading the patched save:

![In-game Stats screen showing Tags sprayed: 100 out of 100](/blogs/img/gtasa-save-reversing/image1.png)

---

## Applications

The concepts discussed so far can be applied to the following topics:

- Malware Analysis
- Exploit Development
- Protocol Reversing

Thank you :-)

# Setting up Jenkins with using Keycloak

This blogpost contains detailed information about;

Setting up an Ubuntu Jammy virtual machine, deploying a Single-server Kubernetes cluster using k3s, implementing Longhorn as the Distributed block storage system, deploying Jenkins through Helm, and integrating Keycloak with Jenkins using SAML and OpenID Connect protocols.

## 1. Using Multipass, setting up an Ubuntu Jammy virtual machine on your local PC/Mac.

Multipass is a tool to generate cloud-style Ubuntu VMs quickly on Linux, macOS, and Windows. After installation process we can check available images with command ;

```bash
multipass find
```

![Screenshot 1](/blogs/img/set-up-jenkins-with-keycloak/1.png)

And, as described on official documentation we should run the command below to run Jammy with necessary Disk space, memory and CPU.

```bash
multipass launch jammy --cpus 4 --disk 60G --memory 8G
```

![Screenshot 2](/blogs/img/set-up-jenkins-with-keycloak/2.png)

After set-up process we're able to get shell for created image.

```bash
multipass shell devoted-boxer
```

![Screenshot 3](/blogs/img/set-up-jenkins-with-keycloak/3.png)

## 2. Deploying a Single-server Kubernetes deployment using k3s

We can quickly run the command below to deploy k3s to our server.

```bash
curl -sfL https://get.k3s.io | sh -
```

After that, with the systemctl we can be sure that it's working properly.

```bash
systemctl status k3s
```

![Screenshot 4](/blogs/img/set-up-jenkins-with-keycloak/4.png)

## 3. Utilizing Longhorn as the Distributed block storage system and use Longhorn controller on the disks created within Kubernetes

First of all, we should install helm to utilize the Longhorn. We can use official documentation to set-up helm on server.

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
```

```bash
sudo apt-get install apt-transport-https --yes
```

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
```

```bash
sudo apt-get update
```

```bash
sudo apt-get install helm
```

After installation we can verify helm installation with the command helm version.

![Screenshot 5](/blogs/img/set-up-jenkins-with-keycloak/5.png)

For the installation of Longhorn, we can use steps that mentioned on official documentation.
Add the Longhorn Helm repository:

```bash
helm repo add longhorn https://charts.longhorn.io
```

Fetch the latest charts from the repository:

```bash
helm repo update
```

Install Longhorn in the longhorn-system namespace.

```bash
helm install longhorn longhorn/longhorn --namespace longhorn-system --create-namespace --version 1.6.0
```

To confirm that the deployment succeeded, we can run:

```bash
kubectl -n longhorn-system get pod
```

![Screenshot 6](/blogs/img/set-up-jenkins-with-keycloak/6.png)

After installation of longhorn, we're able to access Longhorn UI. To access longhorn UI we can use ingress controller.

![Screenshot 7](/blogs/img/set-up-jenkins-with-keycloak/7.png)

```bash
kubectl -n longhorn-system apply -f longhorn-ingress.yml
```

![Screenshot 8](/blogs/img/set-up-jenkins-with-keycloak/8.png)

## 4. Deploying Jenkins into the cluster using Helm.
First of all, we need to create a new namespace for jenkins.

```bash
kubectl create ns jenkins
```

For the installation with helm, we need to run command below:

```bash
helm install jenkins jenkins/jenkins -n jenkins
```

We can see running pod on jenkins namespace with command kubectl get pod -n jenkins.

![Screenshot 9](/blogs/img/set-up-jenkins-with-keycloak/9.png)

We need to get the password of the Jenkins user admin to login with the UI.

```bash
printf $(kubectl get secret --namespace jenkins jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode);echo
```

The password is Bpt5oAz2rVIuSjCBYyAcLb . (Since it's a example I just paste the password in clear text.)

For the accessing UI, there is a 2 option. We can enable ingress controller or we can use port-forward command like below:

```bash
kubectl --namespace jenkins port-forward svc/jenkins 8081:8080 --address 0.0.0.0
```
![Screenshot 10](/blogs/img/set-up-jenkins-with-keycloak/10.png)

We're able to see the persistent volume on Longhorn for the Jenkins.

![Screenshot 11](/blogs/img/set-up-jenkins-with-keycloak/11.png)

![Screenshot 12](/blogs/img/set-up-jenkins-with-keycloak/12.png)

## 5. Deploy Keycloak into the cluster.
To get started of Keycloak installation we should add Helm repository

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

```bash
helm repo update
```

Next, create a new namespace for your Keycloak deployment and install

```bash
kubectl create namespace keycloak
```

```bash
helm install keycloak bitnami/keycloak --namespace keycloak
```

This command will deploy Keycloak with the default configuration, which includes a single replica and an embedded PostgreSQL database.

With kubectl get pods -n keycloak we're able to see running pods.

![Screenshot 13](/blogs/img/set-up-jenkins-with-keycloak/13.png)

We should get the password of the user to login with the UI. To do this we can run command below:

```bash
printf $(kubectl get secret --namespace keycloak keycloak -o jsonpath="{.data.admin-password}" | base64 --decode);echo
```

![Screenshot 14](/blogs/img/set-up-jenkins-with-keycloak/14.png)

The password is YeEZd2W9rB . (Since it's an example I just paste the password in clear text.)

For the accessing UI, there is a 2 option. We can enable ingress controller or we can use port-forward command like below:

```bash
kubectl --namespace keycloak port-forward svc/keycloak 8082:8080 --address 0.0.0.0
```

![Screenshot 15](/blogs/img/set-up-jenkins-with-keycloak/15.png)

We're able to see persistent volumes on Longhorn UI.

![Screenshot 16](/blogs/img/set-up-jenkins-with-keycloak/16.png)

## 6. Integrating Keycloak with Jenkins using SAML and OpenID Connect (OIDC).
For both SAML or OpenID authentication methods, we need to prepare client, realm and a bunch of configuration. I'll provide a detailed description of these steps.

First of all, I used these plugins;

Keycloak Authentication Plugin
Matrix Authorization Strategy Plugin
Role-based Authorization Strategy plugin
SAML

### SAML

Keycloak Configuration

Created a realm named DreamJenkinsSAML on Keycloak.

![Screenshot 17](/blogs/img/set-up-jenkins-with-keycloak/17.png)

Prepare 2 roles as jenkins_admin and jenkins_readonly.

![Screenshot 18](/blogs/img/set-up-jenkins-with-keycloak/18.png)

Prepare 2 users which are named admin and user.

![Screenshot 19](/blogs/img/set-up-jenkins-with-keycloak/19.png)

Assign jenkins_admin role for the admin user.

![Screenshot 20](/blogs/img/set-up-jenkins-with-keycloak/20.png)

Assign jenkins_readonly role to the user.

![Screenshot 21](/blogs/img/set-up-jenkins-with-keycloak/21.png)

So with these steps, Keycloak configuration is ready to use with Jenkins.

### Jenkins Configuration

We should change Jenkins URL from Dashboard > Manage Jenkins > System > Jenkins Location > Jenkins URL.

![Screenshot 22](/blogs/img/set-up-jenkins-with-keycloak/22.png)

We need to install plugins. As mentioned on the official documentation of Configuration as a Code plugin we're not able to install plugins using JCasC.

> To configure a plugin with JCasC:
> 
> Use the UI of the current system to install and configure the plugin

https://www.jenkins.io/doc/book/managing/casc/#configuring-a-plugin-with-jcasc

To install plugins we should go Dashboard > Manage Jenkins > Plugins > Available Plugins.

![Screenshot 23](/blogs/img/set-up-jenkins-with-keycloak/23.png)

So, we're ready to provide .yaml file to Configuration as a code plugin. But first of all let's check the .yaml file.

```yaml
  authorizationStrategy:
    roleBased:
      roles:
        global:
        - entries:
          - user: "admin"
          - group: "jenkins_admin"
          name: "admin"
          pattern: ".*"
          permissions:
          - "Overall/Administer"
        - entries:
          - group: "jenkins_readonly"
          name: "read_only"
          pattern: ".*"
          permissions:
          - "Overall/Read"
...
securityRealm:
    saml:
      binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
      displayNameAttributeName: "urn:oid:2.5.4.42"
      emailAttributeName: "urn:oid:1.2.840.113549.1.9.1"
      groupsAttributeName: "Role"
      idpMetadataConfiguration:
        period: 1440
        url: "http://192.168.64.4:8082/realms/DreamJenkinsSAML/protocol/saml/descriptor"
      maximumAuthenticationLifetime: 86400
      usernameCaseConversion: "none"
```

Here are some key points from the configuration:

Authorization Strategy: Role-based authorization with roles for admin and read-only users.

Security Realm: SAML-based security realm configuration.

I prepared an S3 bucket and uploaded a configuration file to the bucket.

![Screenshot 24](/blogs/img/set-up-jenkins-with-keycloak/24.png)

We can enable this configuration with provide URL to the Configuration as a Code plugin. Dashboard > Manage Jenkins > Configuration as Code

![Screenshot 25](/blogs/img/set-up-jenkins-with-keycloak/25.png)

We can see that The configuration can be applied. We need to click Apply new configuration, and jenkins is updated.

![Screenshot 26](/blogs/img/set-up-jenkins-with-keycloak/26.png)

So, we can check Security settings and we expect that Security Realm is SAML after the uploading this configuration.

![Screenshot 27](/blogs/img/set-up-jenkins-with-keycloak/27.png)

Also, roles should be updated.

![Screenshot 28](/blogs/img/set-up-jenkins-with-keycloak/28.png)

After that, we need to create a client on Keycloak. To do this, we need to go Dashboard > Manage Jenkins > Security and click Service Provider metadata link.

![Screenshot 29](/blogs/img/set-up-jenkins-with-keycloak/29.png)

It's redirect to the http://192.168.64.4:8081/manage/securityRealm/metadata to get metadata for preparing client. We should download this to the file named like jenkins-sp-metadata.xml.

And then we need to go to the Keycloak and click import client.

![Screenshot 30](/blogs/img/set-up-jenkins-with-keycloak/30.png)

With these steps, we need to be able to Login Jenkins with SAML authentication and Role-Based authorization.

Try if SAML authentication working properly:

![Screenshot 31](/blogs/img/set-up-jenkins-with-keycloak/31.png)

Try Admin Access:

Admin user information

![Screenshot 32](/blogs/img/set-up-jenkins-with-keycloak/32.png)

Login jenkins with using admin credentials

![Screenshot 33](/blogs/img/set-up-jenkins-with-keycloak/33.png)

As configured, we can see the admin user uses the name as Kadir.

Admin user credentials:

username: admin / kadirarslan.sec@gmail.com

![Screenshot 34](/blogs/img/set-up-jenkins-with-keycloak/34.png)

We're able to create new jobs or manage jenkins since we're admin.

![Screenshot 35](/blogs/img/set-up-jenkins-with-keycloak/35.png)

Try Read Only user Access:

Read only user credentials:

username: user/kadoarslan@gmail.com

![Screenshot 36](/blogs/img/set-up-jenkins-with-keycloak/36.png)

![Screenshot 37](/blogs/img/set-up-jenkins-with-keycloak/37.png)

This is read only by the user. As you can see it's not able to create jobs or manage jenkins.

### OpenID

Keycloak Configuration

Create a realm named DreamJenkinsOID.

![Screenshot 43](/blogs/img/set-up-jenkins-with-keycloak/43.png)

Create client "jenkins" - set root url to Jenkins-url

![Screenshot 44](/blogs/img/set-up-jenkins-with-keycloak/44.png)

Get adaptor config from Client > Action

![Screenshot 45](/blogs/img/set-up-jenkins-with-keycloak/45.png)

```yaml
{
"realm": "DreamJenkinsOID",
"auth-server-url": "http://192.168.64.4:8082/",
"ssl-required": "external",
"resource": "jenkins",
"public-client": true,
"verify-token-audience": true,
"use-resource-role-mappings": true,
"confidential-port": 0
}
```

Create roles jenkins_admin and jenkins_readonly.

![Screenshot 38](/blogs/img/set-up-jenkins-with-keycloak/38.png)

Create users admin and assign jenkins_admin role.

![Screenshot 39](/blogs/img/set-up-jenkins-with-keycloak/39.png)

![Screenshot 40](/blogs/img/set-up-jenkins-with-keycloak/40.png)

Create a user and assign jenkins_readonly role.

![Screenshot 41](/blogs/img/set-up-jenkins-with-keycloak/41.png)

![Screenshot 42](/blogs/img/set-up-jenkins-with-keycloak/42.png)

### Jenkins  Configuration

We should do the same steps as described in the SAML configuration. Which is installing plugins etc…

After then that we need to install the jenkins-oid.yml file to Jenkins using Configuration as a Code plugin. Here are the keypoints from the jenkins-oid.yml file.

```yaml
authorizationStrategy:
    roleBased:
      roles:
        global:
        - entries:
          - user: "admin"
          - group: "jenkins_admin"
          name: "admin"
          pattern: ".*"
          permissions:
          - "Overall/Administer"
        - entries:
          - group: "jenkins_readonly"
          name: "read_only"
          pattern: ".*"
          permissions:
          - "Overall/Read"
....
securityRealm:
    keycloak:
      keycloakJson: |-
        {
          "realm": "DreamJenkinsOID",
          "auth-server-url": "http://192.168.64.4:8082/",
          "ssl-required": "external",
          "resource": "jenkins",
          "public-client": true,
          "verify-token-audience": true,
          "use-resource-role-mappings": true,
          "confidential-port": 0
        }
      keycloakRespectAccessTokenTimeout: false
      keycloakValidate: false
```

We can apply new configuration as we did on the SAML part.

![Screenshot 46](/blogs/img/set-up-jenkins-with-keycloak/46.png)

After that, we're able to see Security Realm is changed to the Keycloak Authentication plugin and Authorization is Role-Based.

![Screenshot 47](/blogs/img/set-up-jenkins-with-keycloak/47.png)

We're able to login using keycloak open id protocol.

Please check my github repository to get full version of .yaml files. <https://github.com/KadirArslan/Jenkins-Authentication-Authorization>

Conclusion
In this blog post, we dive into setting up an environment using Ubuntu Jammy, Kubernetes with k3s, Longhorn for distributed storage, Jenkins for continuous integration, and Keycloak for identity and access management. We explored each step in detail, from creating virtual machines with Multipass to deploying applications into the Kubernetes cluster and integrating Keycloak for authentication.

By following the provided instructions, readers can replicate the entire setup on their own systems, gaining hands-on experience with modern development tools and techniques. The integration of SAML and OpenID Connect protocols with Keycloak and Jenkins adds an extra layer of security and flexibility to the development workflow, ensuring smooth authentication and authorization processes.

Thank you for taking the time to read this blog post. If you have any questions or need further assistance, feel free to reach out!

If you're interested in discussing these techniques or collaborating on similar research, feel free to join our community on Telegram: [https://t.me/gallipolixyz](https://t.me/gallipolixyz)

[About the Author](https://www.linkedin.com/in/kadirarslan1/)

Kadir is a Security Engineer. He has professional experience in security engineering working with Fortune 500.
# 🚀 Node.js App Deployment on Amazon EKS using AWS CI/CD (Blue-Green Strategy)

This project demonstrates a **production-grade CI/CD pipeline** for a containerized **Node.js application** deployed on **Amazon EKS**, using:

- **AWS CodeCommit** (source control)
- **AWS CodeBuild** (Docker build)
- **Amazon ECR** (image registry)
- **AWS CodePipeline** (CI/CD orchestration)
- **AWS CodeDeploy** (Blue-Green deployment)
- **Amazon EKS** (production environment)

---

## 📌 Project Highlights

✅ **Zero-Downtime Deployments** via Blue-Green Strategy  
✅ **AWS-Native CI/CD Tools**  
✅ **Kubernetes-based Hosting** on EKS  
✅ **End-to-End Pipeline**: From code push to production

---

## 🛠️ Prerequisites

Ensure the following are set up before starting:

- ✅ AWS CLI  
- ✅ Docker  
- ✅ `kubectl` configured for EKS  
- ✅ IAM Role with access to: ECR, CodePipeline, CodeBuild, CodeDeploy, and EKS  
- ✅ An existing **EKS Cluster**

---

## 🏗️ Architecture Flow
Developer → CodeCommit → CodeBuild → ECR → CodeDeploy → EKS (Blue-Green) → User

yaml
Copy
Edit

---

## ⚙️ CI/CD Pipeline Breakdown

### 1️⃣ CodeCommit Repository

Create the repository:

aws codecommit create-repository --repository-name nodejs-eks-app
Push the following files:

Dockerfile

buildspec.yml

appspec.yaml

blue.yaml, green.yaml

Hook scripts

# 2️⃣Dockerfile
Used to build the Node.js container image:

Dockerfile
Copy
Edit
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]

# 3️⃣ buildspec.yml (For CodeBuild)
🧪 Pre-Build Phase
Authenticate Docker to ECR:

bash
Copy
Edit
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
🏗️ Build Phase
Build and tag the image:

bash
Copy
Edit
docker build -t nodejs-eks-app .
docker tag nodejs-eks-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nodejs-eks-app:latest
📤 Post-Build Phase
Push the image and create imagedefinitions.json:

bash
Copy
Edit
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nodejs-eks-app:latest
printf '[{"name":"nodejs","imageUri":"%s"}]' <image-uri> > imagedefinitions.json
🔄 Blue-Green Deployment with CodeDeploy
💠 appspec.yaml
Required by CodeDeploy to define deployment hooks:

yaml
Copy
Edit
version: 0.0
Resources:
  - TargetService:
      Type: AWS::EKS::Service
      Properties:
        TaskDefinition: <placeholder>
        LoadBalancerInfo:
          ContainerName: nodejs
          ContainerPort: 3000
Hooks:
  - BeforeAllowTraffic: scripts/before_traffic.sh
  - AfterAllowTraffic: scripts/after_traffic.sh
💠 Setting Up CodeDeploy
Go to AWS CodeDeploy → Create Application

Platform: Amazon EKS

Deployment type: Blue/Green

Select:

EKS cluster

Target K8s service

Attach appspec.yaml and hook scripts
# 4️⃣ CodePipeline (Orchestration Layer)
AWS CodePipeline automates the full workflow from CodeCommit to CodeDeploy.

It includes:

Source Stage
Pulls source code from CodeCommit.

Build Stage
Uses CodeBuild and buildspec.yml to:

Build Docker image

Push to ECR

Generate imagedefinitions.json

Deploy Stage
Uses CodeDeploy with:

appspec.yaml

before_traffic.sh, after_traffic.sh

# 📦 Kubernetes Deployment Files
# 🔵 Blue Deployment (Live Version)
yaml
Copy
Edit
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-blue
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nodejs
      version: blue
  template:
    metadata:
      labels:
        app: nodejs
        version: blue
    spec:
      containers:
        - name: nodejs
          image: <ecr-image-uri>
          ports:
            - containerPort: 3000
🟢 Green Deployment (Preview Version)
Duplicate of the Blue deployment but with:

yaml
Copy
Edit
metadata:
  name: nodejs-green
Traffic is shifted to Green once validated.

📁 Folder Structure
bash
Copy
Edit
.
├── Dockerfile
├── buildspec.yml
├── appspec.yaml
├── taskdef.json
├── imagedefinitions.json
└── README.md
✅ Conclusion
You’ve now implemented a zero-downtime, production-ready deployment pipeline using:

🔧 AWS-native CI/CD tools

☸️ Amazon EKS (Kubernetes)

🔄 CodeDeploy Blue-Green Strategy

This setup enables continuous delivery with reliability, scalability, and automation for your Node.js applications.



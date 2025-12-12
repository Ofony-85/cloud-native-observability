# Cloud-Native Observability Platform

A production-grade microservices platform on AWS EKS demonstrating complete cloud infrastructure, containerization, and database integration.

**Live Demo:** [Backend API](http://a3916799619d4469c86237b7c1744d19-1157698383.us-east-1.elb.amazonaws.com/health)

[![Infrastructure](https://img.shields.io/badge/Infrastructure-Terraform-purple.svg)](https://www.terraform.io/)
[![Cloud](https://img.shields.io/badge/AWS-EKS%20%7C%20RDS%20%7C%20VPC-orange.svg)](https://aws.amazon.com/)
[![Container](https://img.shields.io/badge/Container-Docker%20%7C%20Kubernetes-blue.svg)](https://kubernetes.io/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()

---

## 🎯 Project Overview

This project demonstrates enterprise-grade cloud infrastructure deployment featuring:
- **Multi-tier architecture** across 2 AWS availability zones
- **Kubernetes orchestration** with EKS (Elastic Kubernetes Service)
- **Containerized microservices** with automated deployments
- **Production database** with PostgreSQL on RDS
- **Infrastructure as Code** with 100% automation
- **Monitoring-ready** with Prometheus metrics

**Built in 6 days** as part of comprehensive cloud engineering learning.

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Cloud (us-east-1)                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              VPC (10.0.0.0/16)                        │   │
│  │                                                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │       Public Subnets (2 AZs)                   │  │   │
│  │  │   ┌─────────────────────────────────────┐      │  │   │
│  │  │   │  Application Load Balancer          │      │  │   │
│  │  │   └───────────────┬─────────────────────┘      │  │   │
│  │  └───────────────────┼──────────────────────────────┘  │   │
│  │                      │                                  │   │
│  │  ┌───────────────────┼──────────────────────────────┐  │   │
│  │  │     Private Subnets (2 AZs)                      │  │   │
│  │  │        ┌──────────▼──────────┐                   │  │   │
│  │  │        │   EKS Cluster        │                   │  │   │
│  │  │        │                      │                   │  │   │
│  │  │        │  ┌────────────────┐ │                   │  │   │
│  │  │        │  │ Backend API    │ │                   │  │   │
│  │  │        │  │ (2 Pods)       │ │                   │  │   │
│  │  │        │  │ FastAPI + Nginx│ │                   │  │   │
│  │  │        │  └────────────────┘ │                   │  │   │
│  │  │        └──────────────────────┘                   │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │       Database Subnets (Private)                 │  │   │
│  │  │   ┌────────────────────────────────────┐         │  │   │
│  │  │   │  RDS PostgreSQL 15.7               │         │  │   │
│  │  │   │  (db.t3.micro - 20GB encrypted)    │         │  │   │
│  │  │   └────────────────────────────────────┘         │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Live Endpoints

### Backend API
**Base URL:** `http://a3916799619d4469c86237b7c1744d19-1157698383.us-east-1.elb.amazonaws.com`

**Available Endpoints:**
- `GET /` - API welcome message
- `GET /health` - Health check endpoint
- `GET /ready` - Readiness probe (includes DB check)
- `GET /api/info` - Server and database information
- `GET /api/items` - List all items from database
- `POST /api/items` - Create new item
- `GET /api/items/{id}` - Get specific item
- `GET /metrics` - Prometheus metrics
- `GET /docs` - Auto-generated API documentation (Swagger UI)

**Test the API:**
```bash
# Health check
curl http://a3916799619d4469c86237b7c1744d19-1157698383.us-east-1.elb.amazonaws.com/health

# Server info
curl http://a3916799619d4469c86237b7c1744d19-1157698383.us-east-1.elb.amazonaws.com/api/info

# Create item
curl -X POST http://a3916799619d4469c86237b7c1744d19-1157698383.us-east-1.elb.amazonaws.com/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "Testing the API"}'

# Get all items
curl http://a3916799619d4469c86237b7c1744d19-1157698383.us-east-1.elb.amazonaws.com/api/items
```

---

## 🛠️ Technology Stack

### Infrastructure & Cloud
- **Cloud Provider:** Amazon Web Services (AWS)
- **Infrastructure as Code:** Terraform v1.10.3
- **Container Orchestration:** Kubernetes v1.31 (Amazon EKS)
- **Networking:** VPC with Multi-AZ deployment
- **Load Balancing:** AWS Application Load Balancer

### Compute & Database
- **Container Runtime:** Docker
- **Application Server:** Uvicorn (ASGI)
- **Database:** PostgreSQL 15.7 on Amazon RDS
- **Storage:** Amazon EBS (encrypted), Amazon EFS ready

### Application
- **Backend Framework:** Python 3.11 + FastAPI
- **ORM:** SQLAlchemy 2.0
- **API Documentation:** Auto-generated with Swagger/OpenAPI
- **Monitoring:** Prometheus metrics client

### DevOps & Tools
- **Version Control:** Git + GitHub
- **Container Registry:** Amazon ECR
- **CLI Tools:** kubectl, AWS CLI, Helm
- **Configuration:** Kubernetes ConfigMaps & Secrets

---

## 📊 Infrastructure Components

### AWS Resources Deployed (43 total)

**Networking (24 resources):**
- 1 VPC (10.0.0.0/16)
- 6 Subnets (2 public, 2 private, 2 database)
- 1 Internet Gateway
- 1 NAT Gateway
- 4 Route Tables
- 8 Security Groups
- Multiple Route Table Associations

**Compute (11 resources):**
- 1 EKS Cluster
- 1 EKS Node Group
- 2 EC2 Instances (t3.medium)
- 3 EKS Add-ons (VPC CNI, kube-proxy, CoreDNS)
- IAM Roles and Policies

**Database (2 resources):**
- 1 RDS PostgreSQL Instance
- 1 DB Subnet Group

**Kubernetes Resources:**
- 2 Backend Pods (FastAPI application)
- 1 LoadBalancer Service
- 1 ConfigMap
- 1 Secret
- 1 Deployment

---

## 🎯 Key Features

### High Availability
- ✅ Multi-AZ deployment across 2 availability zones (us-east-1a, us-east-1b)
- ✅ Automatic pod rescheduling on node failure
- ✅ Load balancer health checks with automatic failover
- ✅ Database with automated backups (7-day retention)

### Security
- ✅ Private subnets for compute workloads (no direct internet access)
- ✅ Database in isolated subnets
- ✅ Security groups with least-privilege access
- ✅ Encrypted database storage (AES-256)
- ✅ Kubernetes secrets for sensitive data

### Scalability
- ✅ Kubernetes-based horizontal scaling ready
- ✅ Load balancer distributing traffic across pods
- ✅ EKS node group can scale from 2-3 nodes
- ✅ Database can scale vertically

### Monitoring
- ✅ Prometheus metrics exposed on `/metrics` endpoint
- ✅ Application health checks (liveness & readiness)
- ✅ Request counters and latency histograms
- ✅ Resource usage tracking

### Automation
- ✅ 100% Infrastructure as Code with Terraform
- ✅ Automated database migrations
- ✅ Container image builds and pushes to ECR
- ✅ Kubernetes declarative deployments

---

## 💻 Local Development Setup

### Prerequisites
- AWS Account with appropriate permissions
- AWS CLI configured
- Terraform >= 1.0
- kubectl
- Docker
- Python 3.11+ (for local development)

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/Ofony-85/cloud-native-observability.git
cd cloud-native-observability

# 2. Deploy infrastructure
cd terraform
terraform init
terraform apply

# 3. Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name observability-dev

# 4. Deploy application
cd ../kubernetes/apps/backend
kubectl apply -f secret.yaml
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# 5. Get LoadBalancer URL
kubectl get service backend
```

---

## 📁 Project Structure
```
cloud-native-observability/
├── terraform/              # Infrastructure as Code
│   ├── main.tf            # Root configuration
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Output values
│   ├── vpc/               # VPC module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── eks/               # EKS cluster module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── rds/               # Database module
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── src/
│   └── backend/           # Backend application
│       ├── app.py         # FastAPI application
│       ├── database.py    # Database models and connection
│       ├── config.py      # Configuration management
│       ├── requirements.txt
│       └── Dockerfile
├── kubernetes/            # Kubernetes manifests
│   └── apps/
│       └── backend/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── configmap.yaml
│           └── secret.yaml
└── docs/                  # Documentation
    ├── architecture/
    ├── COST_ESTIMATE.md
    └── PROJECT_PLAN.md
```

---

## 💰 Cost Analysis

### Monthly Cost Breakdown
| Component | Configuration | Cost/Month |
|-----------|--------------|------------|
| EKS Control Plane | Managed Kubernetes | $73.00 |
| EC2 Nodes | 2 x t3.medium | $60.00 |
| RDS PostgreSQL | db.t3.micro | $15.00 |
| NAT Gateway | Single NAT | $32.00 |
| Load Balancer | Application LB | $16.00 |
| Storage | EBS + backups | $6.00 |
| **Total** | | **~$202/month** |

### Cost Optimization
- Using single NAT Gateway (saves $32/month vs dual NAT)
- t3.micro for RDS (suitable for development/testing)
- t3.medium nodes (good balance of cost and performance)
- Can tear down when not in use (saves $6/day)

---

## 🔧 API Examples

### Create Item
```bash
curl -X POST http://<LOAD-BALANCER-URL>/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example Item",
    "description": "This is a test item"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Example Item",
  "description": "This is a test item",
  "created_at": "2025-12-11T02:39:48.668777Z"
}
```

### Get All Items
```bash
curl http://<LOAD-BALANCER-URL>/api/items
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Example Item",
    "description": "This is a test item",
    "created_at": "2025-12-11T02:39:48.668777Z"
  }
]
```

### Check Metrics
```bash
curl http://<LOAD-BALANCER-URL>/metrics
```

Returns Prometheus-formatted metrics for monitoring.

---

## 🎓 Skills Demonstrated

### Cloud Engineering
- ✅ AWS VPC design and multi-AZ architecture
- ✅ Infrastructure as Code with Terraform
- ✅ Modular infrastructure design
- ✅ Cloud cost optimization strategies

### Kubernetes & Containers
- ✅ EKS cluster deployment and management
- ✅ Docker containerization
- ✅ Kubernetes deployments, services, and configurations
- ✅ Container orchestration and scaling

### Database Management
- ✅ RDS deployment and configuration
- ✅ Database security (private subnets, encryption)
- ✅ Automated backups and disaster recovery
- ✅ SQL and ORM (SQLAlchemy)

### Backend Development
- ✅ REST API design with FastAPI
- ✅ Database integration with SQLAlchemy
- ✅ API documentation with OpenAPI/Swagger
- ✅ Health checks and readiness probes

### DevOps Practices
- ✅ Infrastructure automation
- ✅ Container registry management (ECR)
- ✅ Configuration management (ConfigMaps, Secrets)
- ✅ Monitoring and metrics (Prometheus)
- ✅ Git version control and collaboration

### Networking & Security
- ✅ VPC networking and subnet design
- ✅ Load balancer configuration
- ✅ Security group management
- ✅ Network segmentation (public/private/database tiers)

---

## 🚧 Cleanup

To tear down all infrastructure and stop charges:
```bash
cd terraform
terraform destroy
```

Type `yes` when prompted. This will delete all 43 AWS resources.

---

## 📈 Project Timeline

**Duration:** 6 days  
**Total Resources:** 43 AWS resources  
**Lines of Code:** ~2,500+ (Terraform + Python + Kubernetes YAML)

### Development Progress
- **Day 1:** Project setup and planning
- **Day 2:** Architecture documentation
- **Day 3:** VPC and networking infrastructure (24 resources)
- **Day 4:** EKS cluster deployment (17 resources)
- **Day 5:** RDS PostgreSQL database (2 resources)
- **Day 6:** Backend API development and deployment

---

## 🎯 Future Enhancements

- [ ] Add frontend React application
- [ ] Implement Prometheus + Grafana monitoring stack
- [ ] Add Loki for centralized logging
- [ ] Implement Jaeger for distributed tracing
- [ ] Add Kubecost for cost tracking
- [ ] Configure AlertManager for notifications
- [ ] Implement CI/CD pipeline with GitHub Actions
- [ ] Add HTTPS with AWS Certificate Manager
- [ ] Implement Horizontal Pod Autoscaler
- [ ] Add Helm charts for easier deployment

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Ofonime Offong**

- 🌐 Portfolio: [https://Ofony-85.github.io](https://Ofony-85.github.io)
- 💼 LinkedIn: [linkedin.com/in/ofonime-offong-139322a3](https://linkedin.com/in/ofonime-offong-139322a3)
- 🐙 GitHub: [@Ofony-85](https://github.com/Ofony-85)
- 📧 Email: ofonyme3@gmail.com

---

## 🙏 Acknowledgments

- AWS for comprehensive cloud services and documentation
- HashiCorp for Terraform
- Kubernetes community
- FastAPI framework creators
- Cloud engineering community for resources and support

---

**⭐ If you find this project helpful, please give it a star!**

**Built with ❤️ demonstrating production-grade cloud engineering practices**

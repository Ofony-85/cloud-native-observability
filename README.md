Cloud Native Observability Platform

A production-ready microservices application deployed on AWS EKS with comprehensive monitoring and observability capabilities.

Show Image
Show Image
Show Image
Show Image
Show Image

📋 Table of Contents

Overview
Architecture
Technology Stack
Features
Prerequisites
Deployment
Access URLs
Monitoring & Observability
API Documentation
Project Structure
Cost Optimization
Troubleshooting
Cleanup


🎯 Overview
This project demonstrates a complete cloud-native application architecture with:

Containerized microservices running on Kubernetes
AWS EKS for orchestration
AWS ECR for container registry
PostgreSQL database for data persistence
Prometheus for metrics collection
Grafana for visualization and dashboards
Production-ready configuration with health checks, resource limits, and CORS


🏗️ Architecture
┌─────────────────────────────────────────────────────────────────┐
│                         AWS Cloud (us-east-1)                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    EKS Cluster (2 Nodes)                    │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              Default Namespace                        │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌─────────────────┐      ┌────────────────────┐    │  │ │
│  │  │  │   Frontend      │      │     Backend        │    │  │ │
│  │  │  │   (React/Vite)  │─────▶│   (FastAPI)        │    │  │ │
│  │  │  │   2 Replicas    │      │   3 Replicas       │    │  │ │
│  │  │  │   Port: 80      │      │   Port: 8000       │────┐│  │ │
│  │  │  └─────────────────┘      └────────────────────┘    ││  │ │
│  │  │          │                          │                ││  │ │
│  │  │          │                          │                ││  │ │
│  │  │  ┌───────▼──────────────────────────▼──────┐        ││  │ │
│  │  │  │            LoadBalancers                 │        ││  │ │
│  │  │  │  - Frontend LB (Port 80)                │        ││  │ │
│  │  │  │  - Backend LB (Port 8000)               │        ││  │ │
│  │  │  └──────────────────────────────────────────┘        ││  │ │
│  │  │                                                       ││  │ │
│  │  │  ┌────────────────────────────────────┐              ││  │ │
│  │  │  │        PostgreSQL Database         │◀─────────────┘│  │ │
│  │  │  │        1 Replica                   │               │  │ │
│  │  │  │        Port: 5432                  │               │  │ │
│  │  │  └────────────────────────────────────┘               │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │           Monitoring Namespace                        │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌─────────────────┐      ┌────────────────────┐    │  │ │
│  │  │  │   Prometheus    │◀─────│      Grafana       │    │  │ │
│  │  │  │   (Metrics)     │      │   (Dashboards)     │    │  │ │
│  │  │  │   1 Replica     │      │    1 Replica       │    │  │ │
│  │  │  │   Port: 9090    │      │    Port: 3000      │    │  │ │
│  │  │  └─────────────────┘      └────────────────────┘    │  │ │
│  │  │          │                          │                 │  │ │
│  │  │  ┌───────▼──────────────────────────▼──────┐         │  │ │
│  │  │  │            LoadBalancers                 │         │  │ │
│  │  │  │  - Prometheus LB (Port 9090)            │         │  │ │
│  │  │  │  - Grafana LB (Port 3000)               │         │  │ │
│  │  │  └──────────────────────────────────────────┘         │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │           Kube-System Namespace                       │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌─────────────────┐                                 │  │ │
│  │  │  │  Metrics Server │                                 │  │ │
│  │  │  │  (Resource Mon.)│                                 │  │ │
│  │  │  └─────────────────┘                                 │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                 AWS ECR (Container Registry)                │ │
│  │  - observability/frontend:v2                               │ │
│  │  - observability/backend:v3                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

              ▲                              ▲
              │                              │
          Internet                      Monitoring
            Users                         Team
Architecture Highlights

High Availability: Multiple replicas for frontend (2) and backend (3)
Service Discovery: Kubernetes DNS for inter-service communication
Load Balancing: AWS ELB for external access
Health Checks: Liveness and readiness probes on all services
Resource Management: CPU and memory limits/requests configured
Security: RBAC, service accounts, and network policies


🛠️ Technology Stack
Frontend

Framework: React 18 with Vite
Styling: Inline CSS with gradient designs
HTTP Client: Native Fetch API
Container: Nginx Alpine

Backend

Framework: FastAPI (Python 3.11)
ORM: SQLAlchemy
Database Driver: psycopg2
Metrics: Prometheus Client
ASGI Server: Uvicorn

Database

Database: PostgreSQL 15 Alpine
Storage: Kubernetes EmptyDir (demo) - can be upgraded to PVC

Infrastructure

Orchestration: Kubernetes 1.34 (AWS EKS)
Container Runtime: Docker
Registry: AWS ECR
Cloud Provider: AWS (us-east-1)
Compute: 2x t3.medium EC2 instances

Monitoring

Metrics Collection: Prometheus 2.47
Visualization: Grafana 10.1
Resource Monitoring: Kubernetes Metrics Server


✨ Features
Application Features

✅ Create, read, and list items with descriptions
✅ Real-time health status monitoring
✅ Server information display (hostname, database info)
✅ Persistent data storage in PostgreSQL
✅ Beautiful, responsive UI with gradient design
✅ RESTful API with automatic documentation

DevOps Features

✅ Container orchestration with Kubernetes
✅ Automated deployment with kubectl
✅ Multi-replica scaling for high availability
✅ Load balancing across instances
✅ Health checks and auto-restart
✅ Resource limits and requests
✅ CORS configuration for cross-origin requests

Observability Features

✅ Prometheus metrics scraping
✅ Grafana dashboard integration
✅ Kubernetes metrics server
✅ Application performance monitoring
✅ Infrastructure resource tracking
✅ Custom metrics endpoint (/metrics)


📦 Prerequisites
Required Tools
bash# AWS CLI
aws --version  # AWS CLI 2.x

# Docker
docker --version  # Docker 20.x+

# kubectl
kubectl version --client  # v1.28+

# eksctl (optional, for cluster management)
eksctl version  # 0.150+
AWS Credentials
bash# Configure AWS credentials
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: us-east-1
# Default output format: json

🚀 Deployment
1. Clone the Repository
bashgit clone <repository-url>
cd cloud-native-observability
2. Project Structure
cloud-native-observability/
├── src/
│   ├── backend/
│   │   ├── app.py              # FastAPI application
│   │   ├── config.py           # Configuration management
│   │   ├── database.py         # Database models and connection
│   │   ├── requirements.txt    # Python dependencies
│   │   └── Dockerfile          # Backend container image
│   └── frontend/
│       ├── App.jsx             # Main React component
│       ├── main.jsx            # React entry point
│       ├── index.html          # HTML template
│       ├── package.json        # Node dependencies
│       ├── vite.config.js      # Vite configuration
│       └── Dockerfile          # Frontend container image
├── k8s/
│   ├── backend/
│   │   ├── deployment.yaml     # Backend deployment & service
│   │   ├── postgres.yaml       # PostgreSQL deployment & service
│   │   └── backend-service-lb.yaml  # Backend LoadBalancer
│   ├── frontend/
│   │   └── deployment.yaml     # Frontend deployment & service
│   └── monitoring/
│       ├── prometheus-config.yaml      # Prometheus configuration
│       ├── prometheus-deployment.yaml  # Prometheus resources
│       └── grafana-deployment.yaml     # Grafana resources
└── README.md
3. Build and Push Docker Images
Backend
bashcd src/backend

# Build backend image
docker build -t observability/backend:v3 .

# Authenticate with ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  477094921093.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository \
  --repository-name observability/backend \
  --region us-east-1

# Tag and push
docker tag observability/backend:v3 \
  477094921093.dkr.ecr.us-east-1.amazonaws.com/observability/backend:v3

docker push \
  477094921093.dkr.ecr.us-east-1.amazonaws.com/observability/backend:v3
Frontend
bashcd src/frontend

# Build frontend image
docker build -t observability/frontend:v2 .

# Create ECR repository
aws ecr create-repository \
  --repository-name observability/frontend \
  --region us-east-1

# Tag and push
docker tag observability/frontend:v2 \
  477094921093.dkr.ecr.us-east-1.amazonaws.com/observability/frontend:v2

docker push \
  477094921093.dkr.ecr.us-east-1.amazonaws.com/observability/frontend:v2
4. Deploy to Kubernetes
Deploy Database
bashkubectl apply -f k8s/backend/postgres.yaml
kubectl get pods -l app=postgres
Deploy Backend
bashkubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/backend-service-lb.yaml
kubectl get pods -l app=backend
Deploy Frontend
bashkubectl apply -f k8s/frontend/deployment.yaml
kubectl get pods -l app=frontend
Deploy Monitoring Stack
bash# Create monitoring namespace
kubectl create namespace monitoring

# Install Metrics Server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Deploy Prometheus
kubectl apply -f k8s/monitoring/prometheus-config.yaml
kubectl apply -f k8s/monitoring/prometheus-deployment.yaml

# Deploy Grafana
kubectl apply -f k8s/monitoring/grafana-deployment.yaml

# Verify monitoring stack
kubectl get pods -n monitoring
5. Verify Deployment
bash# Check all pods
kubectl get pods --all-namespaces

# Check services
kubectl get svc --all-namespaces

# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n default

🌐 Access URLs
Production URLs
Frontend Application
http://ac9b8c81b5cef4abb8d529471edbe8e1-1098876561.us-east-1.elb.amazonaws.com

Main application interface
Create and view items
Real-time health monitoring

Backend API
http://ae0de86ca641c4fb7a608940d32df610-641845635.us-east-1.elb.amazonaws.com:8000
API Endpoints:

GET /health - Health check
GET /api/info - Server information
GET /api/items - List all items
POST /api/items - Create new item
GET /metrics - Prometheus metrics

Prometheus
http://aeb48acb3c15244a499f5bdf5c5019af-398506636.us-east-1.elb.amazonaws.com:9090

Metrics collection and querying
Target status monitoring
PromQL query interface

Grafana
http://ab5c8e6820bf8419b993ccddee86b162-1723600162.us-east-1.elb.amazonaws.com:3000

Username: admin
Password: admin123
Dashboard creation and visualization
Alerting configuration


📊 Monitoring & Observability
Prometheus Metrics
The backend exposes the following metrics at /metrics:
# HTTP Request Metrics
http_requests_total{method="GET",endpoint="/api/items",status="200"}
http_request_duration_seconds{method="GET",endpoint="/api/items"}

# System Metrics
process_cpu_seconds_total
process_resident_memory_bytes
Grafana Dashboard Setup

Login to Grafana:

URL: http://<grafana-lb>:3000
Username: admin
Password: admin123


Add Prometheus Data Source:

Go to: Connections → Data Sources → Add data source
Select: Prometheus
URL: http://prometheus.monitoring.svc.cluster.local:9090
Click: Save & Test


Import Dashboards:

Kubernetes Cluster Monitoring: Dashboard ID 6417
Node Exporter Full: Dashboard ID 1860
Custom application metrics



Key Metrics to Monitor

Application Health: Request count, latency, error rates
Database: Connection pool, query duration
Infrastructure: CPU, memory, disk usage
Network: Request throughput, response times


📚 API Documentation
Base URL
http://ae0de86ca641c4fb7a608940d32df610-641845635.us-east-1.elb.amazonaws.com:8000
Endpoints
Health Check
httpGET /health
Response:
json{
  "status": "healthy",
  "app": "Observability Backend API",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-12-12T07:51:41.085330Z"
}
Server Info
httpGET /api/info
Response:
json{
  "app_name": "Observability Backend API",
  "version": "1.0.0",
  "environment": "production",
  "hostname": "backend-597cbfff9f-2h65h",
  "database": {
    "host": "postgres",
    "port": 5432,
    "database": "observability"
  },
  "timestamp": "2025-12-12T07:56:33.494082Z"
}
List Items
httpGET /api/items
Response:
json[
  {
    "id": 1,
    "name": "Test Item from CLI",
    "description": "Created via curl command",
    "created_at": "2025-12-12T07:37:14.098676Z"
  },
  {
    "id": 2,
    "name": "My First Kubernetes Item",
    "description": "Created from the Cloud Observability Platform UI",
    "created_at": "2025-12-12T07:56:33.494082Z"
  }
]
Create Item
httpPOST /api/items
Content-Type: application/json

{
  "name": "New Item",
  "description": "Item description"
}
Response:
json{
  "id": 3,
  "name": "New Item",
  "description": "Item description",
  "created_at": "2025-12-12T08:00:00.000000Z"
}
Prometheus Metrics
httpGET /metrics
Response:
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{endpoint="/api/items",method="GET",status="200"} 42.0
...

💡 Troubleshooting
Common Issues
Pods Not Starting
bash# Check pod status
kubectl get pods -A

# Describe pod to see events
kubectl describe pod <pod-name> -n <namespace>

# Check logs
kubectl logs <pod-name> -n <namespace>
Database Connection Issues
bash# Verify PostgreSQL is running
kubectl get pods -l app=postgres

# Check backend logs for connection errors
kubectl logs -l app=backend --tail=50

# Test database connectivity
kubectl exec -it <backend-pod> -- psql -h postgres -U admin -d observability
LoadBalancer Not Accessible
bash# Check service status
kubectl get svc

# Wait for EXTERNAL-IP (can take 2-3 minutes)
kubectl get svc -w

# Check AWS ELB in console
aws elb describe-load-balancers --region us-east-1
CORS Errors
bash# Verify backend has CORS middleware
kubectl logs -l app=backend | grep -i cors

# Check if backend v3 is deployed
kubectl get deployment backend -o jsonpath='{.spec.template.spec.containers[0].image}'
Metrics Not Showing in Prometheus
bash# Check Prometheus targets
# Visit: http://<prometheus-lb>:9090/targets

# Verify backend annotations
kubectl get pods -l app=backend -o yaml | grep -A 3 annotations

# Test metrics endpoint
curl http://<backend-lb>:8000/metrics

💰 Cost Optimization
Current Infrastructure Cost (Approximate)
ResourceQuantityMonthly Cost (est.)EKS Cluster1$73EC2 t3.medium2 nodes~$60ELB (LoadBalancers)5~$100ECR Storage< 5GB~$1Total~$234/month
Cost Reduction Strategies

Scale Down Replicas:

bashkubectl scale deployment backend --replicas=1
kubectl scale deployment frontend --replicas=1

Use NodePort Instead of LoadBalancers:

bash# Change service type from LoadBalancer to NodePort
kubectl patch svc frontend -p '{"spec":{"type":"NodePort"}}'

Stop Cluster During Off-Hours:

bash# Scale all deployments to 0
kubectl scale deployment --all --replicas=0 -n default
kubectl scale deployment --all --replicas=0 -n monitoring

Use Spot Instances for EKS node groups


🧹 Cleanup
Option 1: Delete Deployments Only (Keep Cluster)
bash# Delete all deployments in default namespace
kubectl delete deployment --all -n default
kubectl delete svc --all -n default

# Delete monitoring stack
kubectl delete deployment --all -n monitoring
kubectl delete svc --all -n monitoring

# Delete namespaces
kubectl delete namespace monitoring
Option 2: Delete Entire Cluster
bash# Delete EKS cluster (WARNING: This is irreversible)
eksctl delete cluster --name observability-cluster --region us-east-1

# This will delete:
# - All pods, services, deployments
# - LoadBalancers
# - EC2 instances
# - VPC resources
Option 3: Clean Up AWS Resources
bash# Delete ECR repositories
aws ecr delete-repository \
  --repository-name observability/frontend \
  --region us-east-1 \
  --force

aws ecr delete-repository \
  --repository-name observability/backend \
  --region us-east-1 \
  --force

# List and delete remaining ELBs (if any)
aws elb describe-load-balancers --region us-east-1
aws elb delete-load-balancer --load-balancer-name <lb-name> --region us-east-1
Verification
bash# Verify cluster deletion
kubectl get nodes
# Should show: "Unable to connect to the server"

# Verify ECR deletion
aws ecr describe-repositories --region us-east-1
# Should show empty or error

# Check AWS Console for any remaining resources

📈 Future Enhancements

 Implement persistent volumes for PostgreSQL
 Add Horizontal Pod Autoscaling (HPA)
 Configure Ingress Controller (nginx/traefik)
 Implement CI/CD pipeline (GitHub Actions/GitLab CI)
 Add authentication and authorization
 Implement distributed tracing (Jaeger/Zipkin)
 Add log aggregation (ELK/Loki)
 Implement backup and disaster recovery
 Add SSL/TLS certificates
 Multi-region deployment


🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request


📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

# 👤 Author

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


🎯 Project Completion Status
✅ Day 1-2: Project setup and local development
✅ Day 3-4: Containerization with Docker
✅ Day 5-6: AWS ECR setup and image registry
✅ Day 7: Kubernetes deployment to EKS
✅ Day 8: Monitoring stack (Prometheus + Grafana)
✅ Production Ready: Full observability platform deployed!
Total Deployment Time: ~8 days
Total Pods Running: 9
Services Exposed: 5 LoadBalancers
Infrastructure: 2-node EKS cluster
Status: ✅ PRODUCTION READY

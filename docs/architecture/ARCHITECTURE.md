# Cloud-Native Observability Platform - Architecture

## Overview

A production-grade microservices platform demonstrating complete observability with metrics, logs, and distributed tracing.

## High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS Cloud (us-east-1)                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    VPC (10.0.0.0/16)                        │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │           Public Subnets (2 AZs)                     │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌─────────────────────────────────────────────┐    │  │ │
│  │  │  │   Application Load Balancer (ALB)           │    │  │ │
│  │  │  └─────────────────┬───────────────────────────┘    │  │ │
│  │  └────────────────────┼──────────────────────────────────┘  │ │
│  │                       │                                      │ │
│  │  ┌────────────────────┼──────────────────────────────────┐  │ │
│  │  │        Private Subnets (2 AZs)                        │  │ │
│  │  │                    │                                   │  │ │
│  │  │  ┌─────────────────▼───────────────────────────────┐ │  │ │
│  │  │  │         EKS Cluster (Kubernetes)                │ │  │ │
│  │  │  │                                                  │ │  │ │
│  │  │  │  ┌──────────────────────────────────────────┐  │ │  │ │
│  │  │  │  │        Application Namespace             │  │ │  │ │
│  │  │  │  │  • Frontend (React)                      │  │ │  │ │
│  │  │  │  │  • Backend API (Python FastAPI)          │  │ │  │ │
│  │  │  │  └──────────────────────────────────────────┘  │ │  │ │
│  │  │  │                                                  │ │  │ │
│  │  │  │  ┌──────────────────────────────────────────┐  │ │  │ │
│  │  │  │  │       Monitoring Namespace               │  │ │  │ │
│  │  │  │  │  • Prometheus (Metrics)                  │  │ │  │ │
│  │  │  │  │  • Grafana (Dashboards)                  │  │ │  │ │
│  │  │  │  │  • Loki (Logs)                           │  │ │  │ │
│  │  │  │  │  • Jaeger (Traces)                       │  │ │  │ │
│  │  │  │  │  • Kubecost (Cost Tracking)              │  │ │  │ │
│  │  │  │  └──────────────────────────────────────────┘  │ │  │ │
│  │  │  └──────────────────────────────────────────────────┘ │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │         Database Subnets (Private)                   │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌─────────────────────────────────────────────┐    │  │ │
│  │  │  │   RDS PostgreSQL (Multi-AZ)                 │    │  │ │
│  │  │  └─────────────────────────────────────────────┘    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Networking Layer
- **VPC:** 10.0.0.0/16
- **Public Subnets:** 2 subnets across 2 AZs for ALB
- **Private Subnets:** 2 subnets across 2 AZs for EKS nodes
- **Database Subnets:** 2 isolated subnets for RDS
- **NAT Gateways:** For outbound internet access from private subnets

### 2. Compute Layer
- **EKS Cluster:** Managed Kubernetes (v1.31)
- **Node Group:** 2 t3.medium instances (can scale to 3)
- **Namespaces:**
  - `app`: Application workloads
  - `monitoring`: Observability stack
  - `kube-system`: Kubernetes system components

### 3. Application Layer
- **Frontend:** React SPA (Single Page Application)
  - Displays API data
  - Shows system metrics
  - User interface
- **Backend API:** Python FastAPI
  - RESTful endpoints
  - Database connections
  - Custom metrics exposure

### 4. Database Layer
- **RDS PostgreSQL 15:**
  - db.t3.micro instance
  - Multi-AZ for high availability
  - 20GB encrypted storage
  - Automated backups

### 5. Observability Layer

#### Metrics (Prometheus + Grafana)
- **Prometheus:** Metrics collection and storage
  - Scrapes metrics every 15 seconds
  - 15-day retention
  - Alert evaluation
- **Grafana:** Visualization and dashboards
  - Application metrics dashboard
  - Infrastructure dashboard
  - Cost dashboard

#### Logging (Loki + Promtail)
- **Loki:** Log aggregation and storage
  - Collects logs from all pods
  - 7-day retention
  - Indexed by labels
- **Promtail:** Log collector
  - Runs as DaemonSet
  - Scrapes container logs

#### Tracing (Jaeger)
- **Jaeger All-in-One:** Distributed tracing
  - Trace collection
  - Trace storage
  - UI for trace visualization

#### Cost Tracking (Kubecost)
- **Kubecost:** Real-time cost monitoring
  - Per-namespace cost allocation
  - Resource efficiency metrics
  - Cost optimization recommendations

## Data Flow

### User Request Flow
1. User → ALB → EKS Ingress → Frontend Service
2. Frontend → Backend API Service
3. Backend API → RDS PostgreSQL
4. Response flows back through chain

### Observability Data Flow
1. **Metrics:** App → Prometheus → Grafana
2. **Logs:** Pods → Promtail → Loki → Grafana
3. **Traces:** App → Jaeger Collector → Jaeger UI

## AWS Resources Created

### Terraform Will Create:
1. **VPC Resources:**
   - 1 VPC
   - 6 Subnets (2 public, 2 private, 2 database)
   - 1 Internet Gateway
   - 2 NAT Gateways
   - 4 Route Tables
   - Security Groups

2. **EKS Resources:**
   - 1 EKS Cluster
   - 1 Node Group (2-3 nodes)
   - IAM Roles and Policies
   - OIDC Provider

3. **RDS Resources:**
   - 1 RDS PostgreSQL Instance
   - 1 DB Subnet Group
   - Security Group

4. **Total Resources:** ~40-45 AWS resources

## Security

### Network Security
- Private subnets for compute and database
- Security groups with least-privilege access
- No direct internet access to application or database

### Application Security
- IAM roles for service accounts (IRSA)
- Secrets stored in Kubernetes Secrets
- Database credentials rotation ready

### Monitoring Security
- Grafana authentication enabled
- Read-only datasource access
- Alert rule access control

## Scalability

### Horizontal Scaling
- EKS nodes: 2 → 3 (manual)
- Application pods: Auto-scaling based on CPU/Memory
- Database: Can scale to larger instance types

### Vertical Scaling
- Node instance types can be changed
- RDS can be scaled up/down
- Storage can be increased

## Cost Optimization

### Current Configuration
- **Compute:** 2 x t3.medium (~$60/month)
- **RDS:** 1 x db.t3.micro (~$15/month)
- **NAT Gateway:** 2 x $30 (~$60/month)
- **ALB:** ~$16/month
- **Data Transfer:** ~$5-10/month
- **Total:** ~$150-170/month

### Cost Reduction Options
1. Use 1 NAT Gateway instead of 2 (save $30/month)
2. Use Spot instances for EKS nodes (save 60-70%)
3. Tear down when not in use
4. Use t3.small nodes instead of medium

## High Availability Features

- Multi-AZ deployment across 2 availability zones
- RDS Multi-AZ with automatic failover
- Multiple EKS nodes for pod redundancy
- Application Load Balancer health checks
- Kubernetes pod auto-restart

## Monitoring Capabilities

### What You Can Monitor:
1. **Application Performance:**
   - Request rate, latency, errors
   - Database query performance
   - API endpoint health

2. **Infrastructure Health:**
   - Node CPU, memory, disk usage
   - Pod resource consumption
   - Network traffic patterns

3. **Business Metrics:**
   - User activity
   - Feature usage
   - Cost per request

4. **Distributed Traces:**
   - Request journey across services
   - Latency bottlenecks
   - Error propagation

## Technology Versions

- Terraform: 1.10.3
- Kubernetes: 1.31
- Prometheus: 2.54.0
- Grafana: 11.0.0
- Loki: 2.9.0
- Jaeger: 1.57.0
- Python: 3.11
- Node.js: 20 LTS

## Success Criteria

Project is considered successful when:
- ✅ All infrastructure deployed via Terraform
- ✅ Applications running and accessible
- ✅ Prometheus collecting metrics
- ✅ Grafana dashboards showing data
- ✅ Loki aggregating logs
- ✅ Jaeger showing distributed traces
- ✅ All components integrated and working
- ✅ Documentation complete
- ✅ Cost under $5/day during development

# Cloud-Native Observability Platform - Architecture

## High-Level Architecture Diagram
```
                                 INTERNET
                                    │
                         ┌──────────▼──────────┐
                         │   Route 53 (Future) │
                         └──────────┬──────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        AWS Cloud (us-east-1)                            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                    VPC (10.0.0.0/16)                            │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │            Public Subnets (2 AZs)                        │  │   │
│  │  │  AZ-1a: 10.0.1.0/24  │  AZ-1b: 10.0.2.0/24             │  │   │
│  │  │                                                           │  │   │
│  │  │        ┌──────────────────────────────────┐             │  │   │
│  │  │        │  Application Load Balancer       │             │  │   │
│  │  │        │  - Health Checks                 │             │  │   │
│  │  │        │  - SSL Termination (Future)      │             │  │   │
│  │  │        │  - Traffic Distribution          │             │  │   │
│  │  │        └────────────┬─────────────────────┘             │  │   │
│  │  └─────────────────────┼───────────────────────────────────┘  │   │
│  │                        │                                        │   │
│  │  ┌─────────────────────▼───────────────────────────────────┐  │   │
│  │  │         Private Subnets (2 AZs)                          │  │   │
│  │  │  AZ-1a: 10.0.11.0/24  │  AZ-1b: 10.0.12.0/24           │  │   │
│  │  │                                                           │  │   │
│  │  │     ┌────────────────────────────────────────┐          │  │   │
│  │  │     │      EKS Cluster (Kubernetes)          │          │  │   │
│  │  │     │                                         │          │  │   │
│  │  │     │  Control Plane (AWS Managed)           │          │  │   │
│  │  │     │  ┌──────────────────────────────────┐  │          │  │   │
│  │  │     │  │  Worker Nodes (2 x t3.medium)    │  │          │  │   │
│  │  │     │  │                                   │  │          │  │   │
│  │  │     │  │  ┌────────────────────────────┐  │  │          │  │   │
│  │  │     │  │  │   Backend Pods (x2)        │  │  │          │  │   │
│  │  │     │  │  │  - FastAPI Application     │  │  │          │  │   │
│  │  │     │  │  │  - Prometheus Metrics      │  │  │          │  │   │
│  │  │     │  │  │  - Health Checks           │  │  │          │  │   │
│  │  │     │  │  └────────────────────────────┘  │  │          │  │   │
│  │  │     │  └──────────────────────────────────┘  │          │  │   │
│  │  │     └────────────────────────────────────────┘          │  │   │
│  │  │                        │                                  │  │   │
│  │  └────────────────────────┼──────────────────────────────────┘  │   │
│  │                           │                                      │   │
│  │  ┌────────────────────────▼──────────────────────────────────┐  │   │
│  │  │       Database Subnets (2 AZs - Private)                  │  │   │
│  │  │  AZ-1a: 10.0.21.0/24  │  AZ-1b: 10.0.22.0/24            │  │   │
│  │  │                                                            │  │   │
│  │  │     ┌────────────────────────────────────────┐           │  │   │
│  │  │     │   RDS PostgreSQL 15.7                  │           │  │   │
│  │  │     │   - db.t3.micro                        │           │  │   │
│  │  │     │   - 20GB Encrypted Storage (gp3)       │           │  │   │
│  │  │     │   - Automated Backups (7 days)         │           │  │   │
│  │  │     │   - Multi-AZ Ready                     │           │  │   │
│  │  │     └────────────────────────────────────────┘           │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │                Internet Gateway                             │  │   │
│  │  │                      │                                      │  │   │
│  │  │                NAT Gateway                                  │  │   │
│  │  │       (Provides outbound internet to private subnets)       │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Network Layer (VPC)
- **VPC CIDR:** 10.0.0.0/16 (65,536 IP addresses)
- **Availability Zones:** us-east-1a, us-east-1b
- **Subnets:** 6 total (2 public, 2 private, 2 database)

### 2. Load Balancing Layer
- **Type:** Application Load Balancer (Layer 7)
- **Availability:** Multi-AZ
- **Health Checks:** Every 30 seconds
- **Target:** Backend Kubernetes Service

### 3. Compute Layer (EKS)
- **Control Plane:** AWS-managed Kubernetes 1.31
- **Worker Nodes:** 2 x t3.medium instances
- **Pod Capacity:** ~35 pods per node
- **Add-ons:** VPC CNI, kube-proxy, CoreDNS

### 4. Application Layer
- **Backend API:** FastAPI on Python 3.11
- **Replicas:** 2 pods for high availability
- **Container Registry:** Amazon ECR
- **Configuration:** ConfigMaps and Secrets

### 5. Database Layer
- **Engine:** PostgreSQL 15.7
- **Instance Class:** db.t3.micro
- **Storage:** 20GB encrypted gp3
- **Backups:** Automated, 7-day retention
- **Networking:** Private subnets only

## Data Flow

### Request Flow
1. Client → Internet
2. Internet → Application Load Balancer (Public Subnet)
3. ALB → Backend Service (Kubernetes)
4. Service → Backend Pods (Private Subnet)
5. Pods → PostgreSQL RDS (Database Subnet)
6. Response flows back through chain

### Security Flow
- **Public Subnets:** Only ALB can be accessed from internet
- **Private Subnets:** Only accessible from ALB (via security groups)
- **Database Subnets:** Only accessible from EKS pods (via security groups)
- **Outbound:** Private subnets use NAT Gateway for internet access

## Security Groups

### ALB Security Group
```
Inbound:
- Port 80 (HTTP) from 0.0.0.0/0
- Port 443 (HTTPS) from 0.0.0.0/0 (Future)

Outbound:
- All traffic
```

### EKS Node Security Group
```
Inbound:
- Port 8000 from ALB Security Group
- All traffic from itself (node-to-node)
- Port 443 from EKS Control Plane

Outbound:
- All traffic
```

### RDS Security Group
```
Inbound:
- Port 5432 (PostgreSQL) from EKS Node Security Group
- Port 5432 from Private Subnet CIDRs

Outbound:
- All traffic
```

## Scalability

### Horizontal Scaling
- **EKS Nodes:** 2 → 3 (configured in Terraform)
- **Backend Pods:** 2 → 10+ (Kubernetes HPA ready)
- **Database:** Can enable Multi-AZ for automatic failover

### Vertical Scaling
- **EKS Nodes:** Can change instance type (t3.medium → t3.large)
- **RDS:** Can scale instance class (db.t3.micro → db.t3.small)
- **Storage:** Auto-scales up to 40GB (2x allocated)

## High Availability

### Redundancy
- ✅ 2 Availability Zones
- ✅ 2 Worker Nodes (one per AZ)
- ✅ 2 Backend Pods (distributed across AZs)
- ✅ Load Balancer distributes traffic
- ✅ Database backup in separate AZ

### Failover Scenarios
1. **Pod Failure:** Kubernetes restarts pod automatically
2. **Node Failure:** Pods reschedule to healthy node
3. **AZ Failure:** Traffic routes to healthy AZ
4. **Database Failure:** Can enable Multi-AZ for automatic failover

## Monitoring & Observability

### Current
- ✅ Application health checks (/health endpoint)
- ✅ Readiness checks (/ready endpoint)
- ✅ Prometheus metrics (/metrics endpoint)
- ✅ ALB health checks

### Future (Days 7-21)
- Prometheus for metrics collection
- Grafana for dashboards
- Loki for log aggregation
- Jaeger for distributed tracing
- AlertManager for notifications
- Kubecost for cost tracking

## Cost Optimization

### Implemented
- Single NAT Gateway (saves $32/month)
- t3.micro for RDS (smallest viable instance)
- Spot instances ready (can save 60-70%)

### Future Optimizations
- Auto-scaling based on actual load
- Reserved instances for predictable workloads
- S3 for static content (cheaper than EC2)
- CloudFront CDN (reduce ALB costs)

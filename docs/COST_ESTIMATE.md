# Cost Estimation

## Monthly Cost Breakdown (Full Time)

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| **EKS Cluster** | Control Plane | $73 |
| **EC2 Nodes** | 2 x t3.medium | $60 |
| **RDS PostgreSQL** | db.t3.micro Multi-AZ | $30 |
| **NAT Gateway** | 2 x NAT Gateway | $60 |
| **Application Load Balancer** | 1 ALB | $16 |
| **EBS Volumes** | 60GB gp3 | $5 |
| **Data Transfer** | Estimate | $10 |
| **CloudWatch Logs** | Basic | $5 |
| **Total** | | **~$259/month** |

## Development Cost (Tear Down Daily)

If you spin up for 8 hours/day, 5 days/week:

| Service | Cost Model | Monthly Cost |
|---------|-----------|--------------|
| **EKS Cluster** | Per hour | $18 |
| **EC2 Nodes** | Per hour | $15 |
| **RDS** | Per hour | $7 |
| **NAT Gateway** | Per hour + data | $20 |
| **ALB** | Per hour + LCU | $6 |
| **Storage** | Per month (persistent) | $5 |
| **Total** | | **~$71/month** |

## Cost Optimization Strategies

### 1. Use Single NAT Gateway
**Savings:** $30/month  
**Trade-off:** Loss of AZ redundancy (acceptable for dev)

### 2. Use Spot Instances for Nodes
**Savings:** $40/month (60-70% cheaper)  
**Trade-off:** Possible interruptions (acceptable for dev)

### 3. Smaller RDS Instance
**Use:** db.t3.micro without Multi-AZ  
**Savings:** $15/month  
**Trade-off:** Less redundancy (acceptable for dev)

### 4. Tear Down When Not Using
**Savings:** 75-80%  
**Best Practice:** 
```bash
# At end of day
terraform destroy --auto-approve

# Next morning
terraform apply --auto-approve
```

## Optimized Development Budget

With all optimizations:

| Configuration | Monthly Cost |
|--------------|--------------|
| Baseline (always on) | $259/month |
| With single NAT | $229/month |
| + Spot instances | $189/month |
| + Part-time usage | **$47/month** |

## Project Budget Recommendation

**For 21-day project:**
- **Option 1:** Keep running 24/7 = ~$180 total
- **Option 2:** 8 hours/day only = ~$35 total
- **Option 3:** Weekdays only = ~$25 total

**Recommended:** Option 2 or 3 for cost efficiency

## AWS Free Tier Benefits

If your account is <12 months old:
- ❌ EKS not included (always paid)
- ✅ EC2: 750 hours/month of t2.micro (we use t3.medium)
- ✅ RDS: 750 hours/month of db.t2.micro (we use t3.micro)
- ✅ Load Balancer: 750 hours/month
- ✅ Data Transfer: 15GB/month outbound

**Free tier won't fully cover this, but helps!**

## Budget Alerts Setup

We'll create CloudWatch billing alerts at:
1. $25 threshold
2. $50 threshold
3. $75 threshold
4. $100 threshold

You'll get email notifications when costs approach limits.

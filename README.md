# Argo Rollouts plugin

This is a [StackSpot](https://docs.stackspot.com) plugin, based on CDK, that adds [Argo Rollouts Kubernetes Controller](https://argoproj.github.io/argo-rollouts/) to an EKS cluster.

See our [StackSpot EKS stack](https://github.com/stack-spot/zup-eks-env-stack) for more information.

# How to use

Go to application folder and type:

```
stk apply plugin zup-eks-env-stack/argorollouts-env-ts-plugin
```

# Prerequisites

## VPC configuration

This plugin uses [AWS ALB Ingress Controller](https://github.com/kubernetes-sigs/aws-load-balancer-controller). So that the controller can manage the load balancers it's required to add some tags to VPC's subnets.

All subnets must be tagged in the format: key "kubernetes.io/cluster/{YOUR_EKS_CLUSTER_NAME}" with value "shared" or "owned".

Private subnets must be tagged in the format: key "kubernetes.io/role/internal-elb" with value "1".

Public subnets must be tagged in the format: key "kubernetes.io/role/elb" with value "1".

See [here](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html) for more information.

## Template

This plugin is applicable in applications that were created from the template [https://github.com/stack-spot/eks-env-ts-template](https://github.com/stack-spot/eks-env-ts-template).

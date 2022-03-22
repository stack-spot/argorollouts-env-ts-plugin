# Argo Rollouts plugin

This is a [StackSpot](https://docs.stackspot.com) plugin, based on CDK, that adds [Argo Rollouts Kubernetes Controller](https://argoproj.github.io/argo-rollouts/) to an EKS cluster.

See our [StackSpot EKS stack](https://github.com/stack-spot/zup-eks-env-stack) for more information.

# How to use

Go to application folder and type:

```
stk apply plugin zup-eks-env-stack/argorollouts-env-ts-plugin
```

# Prerequisites

This plugin is applicable in applications that were created from the template [https://github.com/stack-spot/eks-env-ts-template](https://github.com/stack-spot/eks-env-ts-template).
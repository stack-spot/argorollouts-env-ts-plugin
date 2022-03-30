import { NestedStack, NestedStackProps, aws_iam } from "aws-cdk-lib";
import { Cluster } from "aws-cdk-lib/aws-eks";
import { Construct } from "constructs";
import * as fs from "fs";
import { ManifestUtils } from "./common/manifest-utils";

export class AlbIngressControllerStack extends NestedStack {
    constructor(scope: Construct, id: string, props: AlbIngressControllerStackProps) {
        super(scope, id, props);

        const ALB_INGRESS_NAME = "alb-ingress-controller";
        const ALB_INGRESS_NAMESPACE = "kube-system";

        ManifestUtils.apply(fs.readFileSync("./manifests/rbac-role.yml", "utf-8"), props.eksCluster, ALB_INGRESS_NAMESPACE);

        const policyJsonObj = JSON.parse(fs.readFileSync("./manifests/iam-policy.json", "utf-8"));
        const policy = new aws_iam.Policy(this, "ALBIngressControllerIAMPolicy", {
            document: aws_iam.PolicyDocument.fromJson(policyJsonObj)
        });

        const serviceAccount = props.eksCluster.addServiceAccount(ALB_INGRESS_NAME + "-serviceaccount", {
            "name": ALB_INGRESS_NAME,
            "namespace": ALB_INGRESS_NAMESPACE
        });
        serviceAccount.role.attachInlinePolicy(policy);

        props.eksCluster.addHelmChart("alb-ingress-helm-chart", {
            chart: "aws-load-balancer-controller",
            repository: "https://aws.github.io/eks-charts",
            namespace: ALB_INGRESS_NAMESPACE,
            values: {
                "clusterName": props.eksCluster.clusterName,
                "vpcId": props.eksCluster.vpc.vpcId,
                "region": props.eksCluster.env.region,
                "serviceAccount": {
                    "create": false,
                    "name": ALB_INGRESS_NAME
                },
                "rbac": {
                    "create": false
                }
            }
        }).node.addDependency(serviceAccount);

    }
}

interface AlbIngressControllerStackProps extends NestedStackProps {
    eksCluster: Cluster;
}
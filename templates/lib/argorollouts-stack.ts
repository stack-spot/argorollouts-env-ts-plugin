import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Cluster } from "aws-cdk-lib/aws-eks";
import { Construct } from "constructs";
import * as yaml from "js-yaml";
import got from "got";

export class ArgoRolloutsStack extends NestedStack {
    constructor(scope: Construct, id: string, props: ArgoRolloutsStackProps) {
        super(scope, id, props);

        (async () => {
            try {

                const namespace = props.eksCluster.addManifest("argo-rollouts-namespace", {
                    "apiVersion": "v1",
                    "kind": "Namespace",
                    "metadata": {
                        "name": "argo-rollouts"
                    }
                });

                props.eksCluster.addFargateProfile(
                    "argo-rollouts-fargate-profile", 
                    { 
                        selectors: [{ namespace: "argo-rollouts" }],
                        fargateProfileName: "argo-rollouts-fargate-profile"
                    }
                );

                const manifest = await got.get("https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml").text();
                console.info("Argo Rollouts manifests has been downloaded.");
                yaml.loadAll(manifest, function (doc) {
                    const manifest = doc as Record<string, any>;
                    const kind = manifest["kind"];
                    const name = manifest["metadata"]["name"];

                    manifest["metadata"]["namespace"] = "argo-rollouts";

                    console.debug("Adding manifest: \n", manifest);

                    props.eksCluster.addManifest(`${name}_${kind}`, doc as Record<string, any>).node.addDependency(namespace);
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }
}

interface ArgoRolloutsStackProps extends NestedStackProps {
    eksCluster: Cluster;
}

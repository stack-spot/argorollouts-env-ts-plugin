import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Cluster } from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';
import got from 'got';
import { ManifestUtils } from './common/manifest-utils';

export class ArgoRolloutsStack extends NestedStack {
    constructor(scope: Construct, id: string, props: ArgoRolloutsStackProps) {
        super(scope, id, props);

        const ARGO_ROLLOUTS_NAMESPACE = 'argo-rollouts';

        (async () => {
            try {

                const namespace = props.eksCluster.addManifest('argo-rollouts-namespace', {
                    'apiVersion': 'v1',
                    'kind': 'Namespace',
                    'metadata': {
                        'name': ARGO_ROLLOUTS_NAMESPACE
                    }
                });

                props.eksCluster.addFargateProfile(
                    'argo-rollouts-fargate-profile',
                    {
                        selectors: [{ namespace: ARGO_ROLLOUTS_NAMESPACE }],
                        fargateProfileName: 'argo-rollouts-fargate-profile'
                    }
                );

                const manifest = await got.get('https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml').text();

                console.info('Argo Rollouts manifests has been downloaded.');

                ManifestUtils.apply(manifest, props.eksCluster, ARGO_ROLLOUTS_NAMESPACE, namespace);

            } catch (error) {
                console.log(error);
            }
        })();
    }
}

interface ArgoRolloutsStackProps extends NestedStackProps {
    eksCluster: Cluster;
}

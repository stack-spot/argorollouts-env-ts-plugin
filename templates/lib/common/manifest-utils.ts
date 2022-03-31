import { Cluster, KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import * as yaml from 'js-yaml';

export class ManifestUtils {
    
    public static apply(manifest: string, eksCluster: Cluster, namespace: string, dependency?: KubernetesManifest) {
        yaml.loadAll(manifest, function (doc) {
            const manifestPart = doc as Record<string, any>;
            const kind = manifestPart['kind'];
            const name = manifestPart['metadata']['name'];

            manifestPart['metadata']['namespace'] = namespace;

            console.debug('Adding manifest: \n', manifestPart);

            const added = eksCluster.addManifest(`${name}_${kind}`, manifestPart);
            if (typeof dependency !== 'undefined') {
                added.node.addDependency(dependency);
            }
        });
    }

}
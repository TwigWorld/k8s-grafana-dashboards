// memory usage
sum(container_memory_usage_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name.*"}) / 1024^2

//memory limit
sum(container_spec_memory_limit_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name.*"}) / 1024^2

// memory requests
sum(kube_pod_container_resource_requests_memory_bytes{namespace="$deployment_namespace",pod=~"$deployment_name.*"}) / 1024^2


// memory limit percentage
sum(container_memory_usage_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name.*"}) / sum(container_spec_memory_limit_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name.*"}) * 100


// Memory requests percentage
sum(container_memory_usage_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name.*"}) / sum(kube_pod_container_resource_requests_memory_bytes{namespace="$deployment_namespace",pod=~"$deployment_name.*"}) * 100


// Desired Replicas
max(kube_deployment_spec_replicas{deployment="$deployment_name",namespace="$deployment_namespace"}) without (instance, pod)

// Available replicas
min(kube_deployment_status_replicas_available{deployment="$deployment_name",namespace="$deployment_namespace"}) without (instance, pod)


//Percentage Replicas
max(kube_deployment_spec_replicas{deployment="$deployment_name",namespace="$deployment_namespace"}) / min(kube_deployment_status_replicas_available{deployment="$deployment_name",namespace="$deployment_namespace"}) * 100




// Get correct labels
kube_pod_status_phase{phase="Running"} * on (pod,namespace) group_right kube_pod_labels



// Release label
kube_deployment_status_replicas_available{deployment="ts-twig-graph-twig-graph"} * on (namespace) group_right kube_pod_labels 


// Requests per pod
avg(kube_pod_container_resource_requests_memory_bytes * on (namespace, pod) group_left(label_release) kube_pod_labels {label_release="ts-twig-graph"}) / 1024^2


// Memory usage total
sum(container_memory_usage_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name.*"}) / 1024^2



// Memory usage per pod
sum(container_memory_usage_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name.*"}) / min(kube_deployment_status_replicas_available{deployment="$deployment_name",namespace="$deployment_namespace"}) / 1024^2

// CPU requests total
sum(kube_pod_container_resource_requests_cpu_cores * on (namespace, pod) group_left(label_release) kube_pod_labels {label_release="ts-twig-graph"}) * 1000

// CPU usage total (unsure on this one)
sum(container_cpu_usage_seconds_total{pod_name=~"$deployment_name.*", namespace="$deployment_namespace"})


// CPU percentage (requests)
sum(container_cpu_usage_seconds_total{pod_name=~"$deployment_name.*", namespace="$deployment_namespace"}) / (avg(kube_pod_container_resource_requests_cpu_cores * on (namespace, pod) group_left(label_release) kube_pod_labels {label_release="ts-twig-graph"}) * 1000) * 100




sum(kube_pod_container_resource_requests_memory_bytes{namespace="$deployment_namespace",pod=~"$deployment_name-[a-z0-9]+-[a-z0-9]+$"}) / 1024^2







sum(container_memory_usage_bytes{namespace="$deployment_namespace",pod_name=~"$deployment_name-[a-z0-9]+-[a-z0-9]+$"}) / sum(kube_pod_container_resource_requests_memory_bytes{namespace="$deployment_namespace",pod=~"$deployment_name-[a-z0-9]+-[a-z0-9]+$"}) * 100




// Joins are really hard
// https://github.com/kubernetes/kube-state-metrics/issues/137
sum(kube_pod_info) by(pod,namespace) * on(pod, namespace) group_right() kube_pod_labels
sum(kube_pod_status_phase) by(pod,namespace) * on(pod, namespace) group_right() kube_pod_labels {label_release="tsc-article-notes-svc"}





kube_pod_labels{label_release="ts-authentication-service"}

kube_pod_labels{app="prometheus",chart="prometheus-8.4.5",component="kube-state-metrics",heritage="Tiller",instance="192.168.194.170:8080",job="kubernetes-service-endpoints",kubernetes_name="prometheus-kube-state-metrics",kubernetes_namespace="kube-system",kubernetes_node="ip-192-168-193-171.us-west-2.compute.internal",label_app="authentication-service",label_pod_template_hash="1140428334",label_release="ts-authentication-service",namespace="production",pod="ts-authentication-service-authentication-service-558486d772rms8",release="prometheus"}


// Owner Queries
kube_pod_owner{pod="ts-authentication-service-authentication-service-7677f696458c4t"

kube_replicaset_owner{owner_name="ts-authentication-service-authentication-service"}

kube_replicaset_replicas

kube_replicaset_owner{owner_name="ts-authentication-service-authentication-service"} * on (replicaset) group_right kube_replicaset_spec_replicas > 0





sum(
  max(kube_pod_labels{label_release="$deployment_release"}) by (label_release, pod)
  *
  on(pod)
  group_right(label_release)
  label_replace(
      sum by (pod_name) (
          rate(container_cpu_usage_seconds_total{namespace="$deployment_namespace"}[5m])
      ), "pod", "$1", "pod_name", "(.+)"
  )
) by (label_release)


sum(
  max(kube_pod_owner{owner_name=~"$deployment_name.*"}) by (owner_name, pod)
  *
  on(pod)
  group_right(owner_name)
  label_replace(
      sum by (pod_name) (
          rate(container_memory_usage_bytes{namespace="$deployment_namespace"}[5m])
      ), "pod", "$1", "pod_name", "(.+)"
  )
) by (owner_name) / 1024^2







label_replace(container_memory_usage_bytes{namespace="production"}, "pod", "$1", "pod_name", "(.+)")

label_replace(container_memory_usage_bytes{namespace="production"}, "pod", "$1", "pod_name", "(.+)") * on(namespace, pod) group_left kube_pod_owner


kube_pod_labels
* on(namespace, pod) group_left(host_ip, node, pod_ip)
kube_pod_info
* on(namespace, pod) group_left (owner_is_controller, owner, owner_kind, owner_name)
kube_pod_owner{owner_is_controller="true"}


kube_replicaset_owner{app="prometheus",chart="prometheus-8.4.8",component="kube-state-metrics",heritage="Tiller",instance="192.168.192.184:8080",job="kubernetes-service-endpoints",kubernetes_name="prometheus-kube-state-metrics",kubernetes_namespace="kube-system",kubernetes_node="ip-192-168-193-36.us-west-2.compute.internal",namespace="default",owner_is_controller="true",owner_kind="Deployment",owner_name="swarm-k8s-jenkins-slave",release="prometheus",replicaset="swarm-k8s-jenkins-slave-67bc676f74"}


// Get pod for deployment
label_replace(kube_pod_info_ex{owner_kind="ReplicaSet"}, "replicaset", "$1", "owner_name", "(.+)")
* on (replicaset) group_left (owner_name, owner_kind)
kube_replicaset_owner {owner_name="tsc-assessments-service-assessments-service"}

// Get meomry usage for a deployment (may be incorrect)
label_replace(
    label_replace(kube_pod_info_ex{owner_kind="ReplicaSet"}, "replicaset", "$1", "owner_name", "(.+)")
    * on (replicaset) group_left (owner_name, owner_kind)
    kube_replicaset_owner {owner_name="tsc-assessments-service-assessments-service"}, "pod_name", "$1", "pod", "(.+)"
)
* on(pod_name) group_right
container_memory_usage_bytes

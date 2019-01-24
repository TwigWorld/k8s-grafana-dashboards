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

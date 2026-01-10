package neurofleetx.model;

import java.util.*;

public class Graph {

    private final Map<Node, List<Edge>> adjList = new HashMap<>();

    public void addNode(Node node) {
        adjList.putIfAbsent(node, new ArrayList<>());
    }

    public void addEdge(Node from, Node to, int weight) {

        // Ensure both nodes exist
        addNode(from);
        addNode(to);

        adjList.get(from).add(new Edge(from, to, weight));
    }

    public List<Edge> getEdges(Node node) {
        return adjList.getOrDefault(node, Collections.emptyList());
    }

    public Set<Node> getNodes() {
        return adjList.keySet();
    }

    public Node getNodeById(String id) {
        return adjList.keySet().stream()
                .filter(node -> node.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}

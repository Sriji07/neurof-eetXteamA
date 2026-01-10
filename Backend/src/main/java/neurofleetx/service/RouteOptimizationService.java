package neurofleetx.service;

import neurofleetx.algorithms.DijkstraAlgorithm;
import neurofleetx.model.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RouteOptimizationService {

    private final Graph graph;

    public RouteOptimizationService() {
        this.graph = new Graph();

        // Initialize graph once
        Node A = new Node("A");
        Node B = new Node("B");
        Node C = new Node("C");

        graph.addEdge(A, B, 5);
        graph.addEdge(B, C, 3);
        graph.addEdge(A, C, 10);
    }

    public Map<String, Integer> optimizeRoute(String startNodeId) {

        if (startNodeId == null || startNodeId.isBlank()) {
            return Collections.emptyMap();
        }

        Node startNode = graph.getNodeById(startNodeId);

        if (startNode == null) {
            return Collections.emptyMap();
        }

        Map<Node, Integer> distances = DijkstraAlgorithm.findShortestPath(graph, startNode);

        // Convert Node -> String (API-safe)
        return distances.entrySet()
                .stream()
                .collect(Collectors.toMap(
                        e -> e.getKey().getId(),
                        Map.Entry::getValue));
    }
}

package neurofleetx.algorithms;

import neurofleetx.model.*;
import java.util.*;

public class DijkstraAlgorithm {

    public static Map<Node, Integer> findShortestPath(Graph graph, Node source) {

        Map<Node, Integer> distance = new HashMap<>();
        Set<Node> visited = new HashSet<>();

        PriorityQueue<Node> pq = new PriorityQueue<>(
                Comparator.comparingInt(
                        n -> distance.getOrDefault(n, Integer.MAX_VALUE)));

        // Initialize distances for all nodes
        for (Node node : graph.getNodes()) {
            distance.put(node, Integer.MAX_VALUE);
        }

        distance.put(source, 0);
        pq.add(source);

        while (!pq.isEmpty()) {
            Node current = pq.poll();

            if (visited.contains(current)) {
                continue;
            }
            visited.add(current);

            int currentDist = distance.get(current);
            if (currentDist == Integer.MAX_VALUE) {
                continue;
            }

            for (Edge edge : graph.getEdges(current)) {

                Node neighbor = edge.getTo();
                int newDist = currentDist + edge.getWeight();

                if (newDist < distance.get(neighbor)) {
                    distance.put(neighbor, newDist);
                    pq.add(neighbor);
                }
            }
        }

        return distance;
    }
}
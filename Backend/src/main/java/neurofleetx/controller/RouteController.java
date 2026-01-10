package neurofleetx.controller;

import neurofleetx.service.RouteOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/route")
public class RouteController {

    private final RouteOptimizationService service;

    public RouteController(RouteOptimizationService service) {
        this.service = service;
    }

    @GetMapping("/optimize")
    public ResponseEntity<Map<String, Integer>> optimizeRoute(
            @RequestParam String startNode) {

        if (startNode == null || startNode.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Map<String, Integer> result = service.optimizeRoute(startNode);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);
    }
}

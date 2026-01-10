//REST controller for providing maintenance analytics
package neurofleetx.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/maintenance/analytics")
public class MaintenanceAnalyticsController {

    @GetMapping
    public String getAnalytics() {
        return "Analytics data";
    }
}

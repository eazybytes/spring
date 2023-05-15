package com.eazybytes.eazyschool.audit;

import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class EazySchoolInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        Map<String, String> eazyMap = new HashMap<String, String>();
        eazyMap.put("App Name", "EazySchool");
        eazyMap.put("App Description", "Eazy School Web Application for Students and Admin");
        eazyMap.put("App Version", "1.0.0");
        eazyMap.put("Contact Email", "info@eazyschool.com");
        eazyMap.put("Contact Mobile", "+1(21) 673 4587");
        builder.withDetail("eazyschool-info", eazyMap);
    }

}

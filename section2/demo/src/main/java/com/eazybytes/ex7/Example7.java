package com.eazybytes.ex7;

import com.eazybytes.ex7.beans.MyService;
import com.eazybytes.ex7.beans.UserSession;
import com.eazybytes.ex7.config.ProjectScopeConfig;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Example7 {

    static void main() {
        var context = new AnnotationConfigApplicationContext(ProjectScopeConfig.class);
        var myservice1 = context.getBean(MyService.class);
        var myservice2 = context.getBean(MyService.class);
        System.out.println(myservice1.hashCode());
        System.out.println(myservice2.hashCode());
        var user1 = context.getBean(UserSession.class);
        var user2 = context.getBean(UserSession.class);
        System.out.println(user1.hashCode());
        System.out.println(user2.hashCode());
        System.out.println(user1.getSessionId());
        System.out.println(user2.getSessionId());
    }

}

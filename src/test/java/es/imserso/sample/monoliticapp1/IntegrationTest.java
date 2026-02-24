package es.imserso.sample.monoliticapp1;

import es.imserso.sample.monoliticapp1.config.AsyncSyncConfiguration;
import es.imserso.sample.monoliticapp1.config.EmbeddedSQL;
import es.imserso.sample.monoliticapp1.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    classes = {
        JhipsterMonoliticSampleApplicationApp.class,
        JacksonConfiguration.class,
        AsyncSyncConfiguration.class,
        es.imserso.sample.monoliticapp1.config.JacksonHibernateConfiguration.class,
    }
)
@EmbeddedSQL
public @interface IntegrationTest {}

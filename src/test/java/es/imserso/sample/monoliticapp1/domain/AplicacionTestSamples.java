package es.imserso.sample.monoliticapp1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AplicacionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Aplicacion getAplicacionSample1() {
        return new Aplicacion().id(1L).nombre("nombre1");
    }

    public static Aplicacion getAplicacionSample2() {
        return new Aplicacion().id(2L).nombre("nombre2");
    }

    public static Aplicacion getAplicacionRandomSampleGenerator() {
        return new Aplicacion().id(longCount.incrementAndGet()).nombre(UUID.randomUUID().toString());
    }
}

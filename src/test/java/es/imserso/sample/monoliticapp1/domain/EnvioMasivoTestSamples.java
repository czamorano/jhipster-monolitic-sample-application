package es.imserso.sample.monoliticapp1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EnvioMasivoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static EnvioMasivo getEnvioMasivoSample1() {
        return new EnvioMasivo().id(1L).identificador("identificador1");
    }

    public static EnvioMasivo getEnvioMasivoSample2() {
        return new EnvioMasivo().id(2L).identificador("identificador2");
    }

    public static EnvioMasivo getEnvioMasivoRandomSampleGenerator() {
        return new EnvioMasivo().id(longCount.incrementAndGet()).identificador(UUID.randomUUID().toString());
    }
}

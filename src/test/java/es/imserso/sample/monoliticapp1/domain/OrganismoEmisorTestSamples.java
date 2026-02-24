package es.imserso.sample.monoliticapp1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class OrganismoEmisorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static OrganismoEmisor getOrganismoEmisorSample1() {
        return new OrganismoEmisor().id(1L).nombre("nombre1").codigo("codigo1");
    }

    public static OrganismoEmisor getOrganismoEmisorSample2() {
        return new OrganismoEmisor().id(2L).nombre("nombre2").codigo("codigo2");
    }

    public static OrganismoEmisor getOrganismoEmisorRandomSampleGenerator() {
        return new OrganismoEmisor()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .codigo(UUID.randomUUID().toString());
    }
}

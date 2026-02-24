package es.imserso.sample.monoliticapp1.domain;

import static es.imserso.sample.monoliticapp1.domain.AplicacionTestSamples.*;
import static es.imserso.sample.monoliticapp1.domain.EnvioMasivoTestSamples.*;
import static es.imserso.sample.monoliticapp1.domain.OrganismoEmisorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import es.imserso.sample.monoliticapp1.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnvioMasivoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EnvioMasivo.class);
        EnvioMasivo envioMasivo1 = getEnvioMasivoSample1();
        EnvioMasivo envioMasivo2 = new EnvioMasivo();
        assertThat(envioMasivo1).isNotEqualTo(envioMasivo2);

        envioMasivo2.setId(envioMasivo1.getId());
        assertThat(envioMasivo1).isEqualTo(envioMasivo2);

        envioMasivo2 = getEnvioMasivoSample2();
        assertThat(envioMasivo1).isNotEqualTo(envioMasivo2);
    }

    @Test
    void aplicacionTest() {
        EnvioMasivo envioMasivo = getEnvioMasivoRandomSampleGenerator();
        Aplicacion aplicacionBack = getAplicacionRandomSampleGenerator();

        envioMasivo.setAplicacion(aplicacionBack);
        assertThat(envioMasivo.getAplicacion()).isEqualTo(aplicacionBack);

        envioMasivo.aplicacion(null);
        assertThat(envioMasivo.getAplicacion()).isNull();
    }

    @Test
    void organismoEmisorTest() {
        EnvioMasivo envioMasivo = getEnvioMasivoRandomSampleGenerator();
        OrganismoEmisor organismoEmisorBack = getOrganismoEmisorRandomSampleGenerator();

        envioMasivo.setOrganismoEmisor(organismoEmisorBack);
        assertThat(envioMasivo.getOrganismoEmisor()).isEqualTo(organismoEmisorBack);

        envioMasivo.organismoEmisor(null);
        assertThat(envioMasivo.getOrganismoEmisor()).isNull();
    }
}

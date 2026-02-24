package es.imserso.sample.monoliticapp1.domain;

import static es.imserso.sample.monoliticapp1.domain.AplicacionTestSamples.*;
import static es.imserso.sample.monoliticapp1.domain.EnvioMasivoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import es.imserso.sample.monoliticapp1.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AplicacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Aplicacion.class);
        Aplicacion aplicacion1 = getAplicacionSample1();
        Aplicacion aplicacion2 = new Aplicacion();
        assertThat(aplicacion1).isNotEqualTo(aplicacion2);

        aplicacion2.setId(aplicacion1.getId());
        assertThat(aplicacion1).isEqualTo(aplicacion2);

        aplicacion2 = getAplicacionSample2();
        assertThat(aplicacion1).isNotEqualTo(aplicacion2);
    }

    @Test
    void envioMasivoTest() {
        Aplicacion aplicacion = getAplicacionRandomSampleGenerator();
        EnvioMasivo envioMasivoBack = getEnvioMasivoRandomSampleGenerator();

        aplicacion.addEnvioMasivo(envioMasivoBack);
        assertThat(aplicacion.getEnvioMasivos()).containsOnly(envioMasivoBack);
        assertThat(envioMasivoBack.getAplicacion()).isEqualTo(aplicacion);

        aplicacion.removeEnvioMasivo(envioMasivoBack);
        assertThat(aplicacion.getEnvioMasivos()).doesNotContain(envioMasivoBack);
        assertThat(envioMasivoBack.getAplicacion()).isNull();

        aplicacion.envioMasivos(new HashSet<>(Set.of(envioMasivoBack)));
        assertThat(aplicacion.getEnvioMasivos()).containsOnly(envioMasivoBack);
        assertThat(envioMasivoBack.getAplicacion()).isEqualTo(aplicacion);

        aplicacion.setEnvioMasivos(new HashSet<>());
        assertThat(aplicacion.getEnvioMasivos()).doesNotContain(envioMasivoBack);
        assertThat(envioMasivoBack.getAplicacion()).isNull();
    }
}

package es.imserso.sample.monoliticapp1.domain;

import static es.imserso.sample.monoliticapp1.domain.EnvioMasivoTestSamples.*;
import static es.imserso.sample.monoliticapp1.domain.OrganismoEmisorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import es.imserso.sample.monoliticapp1.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class OrganismoEmisorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrganismoEmisor.class);
        OrganismoEmisor organismoEmisor1 = getOrganismoEmisorSample1();
        OrganismoEmisor organismoEmisor2 = new OrganismoEmisor();
        assertThat(organismoEmisor1).isNotEqualTo(organismoEmisor2);

        organismoEmisor2.setId(organismoEmisor1.getId());
        assertThat(organismoEmisor1).isEqualTo(organismoEmisor2);

        organismoEmisor2 = getOrganismoEmisorSample2();
        assertThat(organismoEmisor1).isNotEqualTo(organismoEmisor2);
    }

    @Test
    void envioMasivoTest() {
        OrganismoEmisor organismoEmisor = getOrganismoEmisorRandomSampleGenerator();
        EnvioMasivo envioMasivoBack = getEnvioMasivoRandomSampleGenerator();

        organismoEmisor.addEnvioMasivo(envioMasivoBack);
        assertThat(organismoEmisor.getEnvioMasivos()).containsOnly(envioMasivoBack);
        assertThat(envioMasivoBack.getOrganismoEmisor()).isEqualTo(organismoEmisor);

        organismoEmisor.removeEnvioMasivo(envioMasivoBack);
        assertThat(organismoEmisor.getEnvioMasivos()).doesNotContain(envioMasivoBack);
        assertThat(envioMasivoBack.getOrganismoEmisor()).isNull();

        organismoEmisor.envioMasivos(new HashSet<>(Set.of(envioMasivoBack)));
        assertThat(organismoEmisor.getEnvioMasivos()).containsOnly(envioMasivoBack);
        assertThat(envioMasivoBack.getOrganismoEmisor()).isEqualTo(organismoEmisor);

        organismoEmisor.setEnvioMasivos(new HashSet<>());
        assertThat(organismoEmisor.getEnvioMasivos()).doesNotContain(envioMasivoBack);
        assertThat(envioMasivoBack.getOrganismoEmisor()).isNull();
    }
}

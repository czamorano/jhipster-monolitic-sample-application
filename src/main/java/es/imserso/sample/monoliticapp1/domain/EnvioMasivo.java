package es.imserso.sample.monoliticapp1.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import es.imserso.sample.monoliticapp1.domain.enumeration.EstadoEnvioMasivo;
import es.imserso.sample.monoliticapp1.domain.enumeration.TipoEnvioMasivo;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EnvioMasivo.
 */
@Entity
@Table(name = "envio_masivo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EnvioMasivo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "identificador", nullable = false)
    private String identificador;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoEnvioMasivo tipo;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoEnvioMasivo estado;

    @Column(name = "comienzo")
    private Instant comienzo;

    @Column(name = "fin")
    private Instant fin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "envioMasivos" }, allowSetters = true)
    private Aplicacion aplicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "envioMasivos" }, allowSetters = true)
    private OrganismoEmisor organismoEmisor;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EnvioMasivo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdentificador() {
        return this.identificador;
    }

    public EnvioMasivo identificador(String identificador) {
        this.setIdentificador(identificador);
        return this;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public TipoEnvioMasivo getTipo() {
        return this.tipo;
    }

    public EnvioMasivo tipo(TipoEnvioMasivo tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(TipoEnvioMasivo tipo) {
        this.tipo = tipo;
    }

    public EstadoEnvioMasivo getEstado() {
        return this.estado;
    }

    public EnvioMasivo estado(EstadoEnvioMasivo estado) {
        this.setEstado(estado);
        return this;
    }

    public void setEstado(EstadoEnvioMasivo estado) {
        this.estado = estado;
    }

    public Instant getComienzo() {
        return this.comienzo;
    }

    public EnvioMasivo comienzo(Instant comienzo) {
        this.setComienzo(comienzo);
        return this;
    }

    public void setComienzo(Instant comienzo) {
        this.comienzo = comienzo;
    }

    public Instant getFin() {
        return this.fin;
    }

    public EnvioMasivo fin(Instant fin) {
        this.setFin(fin);
        return this;
    }

    public void setFin(Instant fin) {
        this.fin = fin;
    }

    public Aplicacion getAplicacion() {
        return this.aplicacion;
    }

    public void setAplicacion(Aplicacion aplicacion) {
        this.aplicacion = aplicacion;
    }

    public EnvioMasivo aplicacion(Aplicacion aplicacion) {
        this.setAplicacion(aplicacion);
        return this;
    }

    public OrganismoEmisor getOrganismoEmisor() {
        return this.organismoEmisor;
    }

    public void setOrganismoEmisor(OrganismoEmisor organismoEmisor) {
        this.organismoEmisor = organismoEmisor;
    }

    public EnvioMasivo organismoEmisor(OrganismoEmisor organismoEmisor) {
        this.setOrganismoEmisor(organismoEmisor);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EnvioMasivo)) {
            return false;
        }
        return getId() != null && getId().equals(((EnvioMasivo) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EnvioMasivo{" +
            "id=" + getId() +
            ", identificador='" + getIdentificador() + "'" +
            ", tipo='" + getTipo() + "'" +
            ", estado='" + getEstado() + "'" +
            ", comienzo='" + getComienzo() + "'" +
            ", fin='" + getFin() + "'" +
            "}";
    }
}

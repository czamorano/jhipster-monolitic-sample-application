package es.imserso.sample.monoliticapp1.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * not an ignored comment
 */
@Schema(description = "not an ignored comment")
@Entity
@Table(name = "organismo_emisor")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrganismoEmisor implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "codigo", nullable = false)
    private String codigo;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "organismoEmisor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "aplicacion", "organismoEmisor" }, allowSetters = true)
    private Set<EnvioMasivo> envioMasivos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrganismoEmisor id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public OrganismoEmisor nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public OrganismoEmisor codigo(String codigo) {
        this.setCodigo(codigo);
        return this;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Set<EnvioMasivo> getEnvioMasivos() {
        return this.envioMasivos;
    }

    public void setEnvioMasivos(Set<EnvioMasivo> envioMasivos) {
        if (this.envioMasivos != null) {
            this.envioMasivos.forEach(i -> i.setOrganismoEmisor(null));
        }
        if (envioMasivos != null) {
            envioMasivos.forEach(i -> i.setOrganismoEmisor(this));
        }
        this.envioMasivos = envioMasivos;
    }

    public OrganismoEmisor envioMasivos(Set<EnvioMasivo> envioMasivos) {
        this.setEnvioMasivos(envioMasivos);
        return this;
    }

    public OrganismoEmisor addEnvioMasivo(EnvioMasivo envioMasivo) {
        this.envioMasivos.add(envioMasivo);
        envioMasivo.setOrganismoEmisor(this);
        return this;
    }

    public OrganismoEmisor removeEnvioMasivo(EnvioMasivo envioMasivo) {
        this.envioMasivos.remove(envioMasivo);
        envioMasivo.setOrganismoEmisor(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrganismoEmisor)) {
            return false;
        }
        return getId() != null && getId().equals(((OrganismoEmisor) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrganismoEmisor{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", codigo='" + getCodigo() + "'" +
            "}";
    }
}

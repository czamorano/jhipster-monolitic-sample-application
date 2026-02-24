package es.imserso.sample.monoliticapp1.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Aplicacion.
 */
@Entity
@Table(name = "aplicacion")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Aplicacion implements Serializable {

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

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "aplicacion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "aplicacion", "organismoEmisor" }, allowSetters = true)
    private Set<EnvioMasivo> envioMasivos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Aplicacion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Aplicacion nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<EnvioMasivo> getEnvioMasivos() {
        return this.envioMasivos;
    }

    public void setEnvioMasivos(Set<EnvioMasivo> envioMasivos) {
        if (this.envioMasivos != null) {
            this.envioMasivos.forEach(i -> i.setAplicacion(null));
        }
        if (envioMasivos != null) {
            envioMasivos.forEach(i -> i.setAplicacion(this));
        }
        this.envioMasivos = envioMasivos;
    }

    public Aplicacion envioMasivos(Set<EnvioMasivo> envioMasivos) {
        this.setEnvioMasivos(envioMasivos);
        return this;
    }

    public Aplicacion addEnvioMasivo(EnvioMasivo envioMasivo) {
        this.envioMasivos.add(envioMasivo);
        envioMasivo.setAplicacion(this);
        return this;
    }

    public Aplicacion removeEnvioMasivo(EnvioMasivo envioMasivo) {
        this.envioMasivos.remove(envioMasivo);
        envioMasivo.setAplicacion(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Aplicacion)) {
            return false;
        }
        return getId() != null && getId().equals(((Aplicacion) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Aplicacion{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            "}";
    }
}

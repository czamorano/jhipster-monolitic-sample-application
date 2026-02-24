package es.imserso.sample.monoliticapp1.service.impl;

import es.imserso.sample.monoliticapp1.domain.Aplicacion;
import es.imserso.sample.monoliticapp1.repository.AplicacionRepository;
import es.imserso.sample.monoliticapp1.service.AplicacionService;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link es.imserso.sample.monoliticapp1.domain.Aplicacion}.
 */
@Service
@Transactional
public class AplicacionServiceImpl implements AplicacionService {

    private static final Logger LOG = LoggerFactory.getLogger(AplicacionServiceImpl.class);

    private final AplicacionRepository aplicacionRepository;

    public AplicacionServiceImpl(AplicacionRepository aplicacionRepository) {
        this.aplicacionRepository = aplicacionRepository;
    }

    @Override
    public Aplicacion save(Aplicacion aplicacion) {
        LOG.debug("Request to save Aplicacion : {}", aplicacion);
        return aplicacionRepository.save(aplicacion);
    }

    @Override
    public Aplicacion update(Aplicacion aplicacion) {
        LOG.debug("Request to update Aplicacion : {}", aplicacion);
        return aplicacionRepository.save(aplicacion);
    }

    @Override
    public Optional<Aplicacion> partialUpdate(Aplicacion aplicacion) {
        LOG.debug("Request to partially update Aplicacion : {}", aplicacion);

        return aplicacionRepository
            .findById(aplicacion.getId())
            .map(existingAplicacion -> {
                updateIfPresent(existingAplicacion::setNombre, aplicacion.getNombre());

                return existingAplicacion;
            })
            .map(aplicacionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Aplicacion> findAll(Pageable pageable) {
        LOG.debug("Request to get all Aplicacions");
        return aplicacionRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Aplicacion> findOne(Long id) {
        LOG.debug("Request to get Aplicacion : {}", id);
        return aplicacionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Aplicacion : {}", id);
        aplicacionRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}

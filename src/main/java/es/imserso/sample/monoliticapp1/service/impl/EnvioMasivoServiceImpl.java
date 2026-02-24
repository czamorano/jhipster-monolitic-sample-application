package es.imserso.sample.monoliticapp1.service.impl;

import es.imserso.sample.monoliticapp1.domain.EnvioMasivo;
import es.imserso.sample.monoliticapp1.repository.EnvioMasivoRepository;
import es.imserso.sample.monoliticapp1.service.EnvioMasivoService;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link es.imserso.sample.monoliticapp1.domain.EnvioMasivo}.
 */
@Service
@Transactional
public class EnvioMasivoServiceImpl implements EnvioMasivoService {

    private static final Logger LOG = LoggerFactory.getLogger(EnvioMasivoServiceImpl.class);

    private final EnvioMasivoRepository envioMasivoRepository;

    public EnvioMasivoServiceImpl(EnvioMasivoRepository envioMasivoRepository) {
        this.envioMasivoRepository = envioMasivoRepository;
    }

    @Override
    public EnvioMasivo save(EnvioMasivo envioMasivo) {
        LOG.debug("Request to save EnvioMasivo : {}", envioMasivo);
        return envioMasivoRepository.save(envioMasivo);
    }

    @Override
    public EnvioMasivo update(EnvioMasivo envioMasivo) {
        LOG.debug("Request to update EnvioMasivo : {}", envioMasivo);
        return envioMasivoRepository.save(envioMasivo);
    }

    @Override
    public Optional<EnvioMasivo> partialUpdate(EnvioMasivo envioMasivo) {
        LOG.debug("Request to partially update EnvioMasivo : {}", envioMasivo);

        return envioMasivoRepository
            .findById(envioMasivo.getId())
            .map(existingEnvioMasivo -> {
                updateIfPresent(existingEnvioMasivo::setIdentificador, envioMasivo.getIdentificador());
                updateIfPresent(existingEnvioMasivo::setTipo, envioMasivo.getTipo());
                updateIfPresent(existingEnvioMasivo::setEstado, envioMasivo.getEstado());
                updateIfPresent(existingEnvioMasivo::setComienzo, envioMasivo.getComienzo());
                updateIfPresent(existingEnvioMasivo::setFin, envioMasivo.getFin());

                return existingEnvioMasivo;
            })
            .map(envioMasivoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EnvioMasivo> findAll(Pageable pageable) {
        LOG.debug("Request to get all EnvioMasivos");
        return envioMasivoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EnvioMasivo> findOne(Long id) {
        LOG.debug("Request to get EnvioMasivo : {}", id);
        return envioMasivoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete EnvioMasivo : {}", id);
        envioMasivoRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}

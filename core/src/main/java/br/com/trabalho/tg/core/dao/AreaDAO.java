package br.com.trabalho.tg.core.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.trabalho.tg.core.model.SDLArea;

@Repository("sdlAreaDAO")
public interface AreaDAO extends JpaRepository<SDLArea, Long>{
	
	SDLArea findByDescricao(String descricao);
	
	SDLArea findByCodigoAndIdLocal(String codigo, long local);
	
	List<SDLArea> findByidLocal(Long idLocal);

	@Query("select t.locale from #{#entityName} t where t.codigo = ?1 and t.idLocal = ?2")
	byte[] findLocaleByCodigoAndIdLocal(String codigo, long local);
	
	@Query("select t.codigo, t.descricao from #{#entityName} t where t.idLocal = ?1")
	List<Object[]> findCodigoAndDescricaoByLocal(Long local);
	
	@Query("select t.id, t.codigo, t.descricao, t.idLocal, t.locale from #{#entityName} t where t.idLocal = ?1")
	List<Object[]> findWithOutLocationByIdLocal(Long local);
	

}

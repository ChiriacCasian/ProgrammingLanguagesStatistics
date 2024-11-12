package backend.java.DataLoader;

import backend.java.DataLoader.Commons.ProvinceClient;
import backend.java.DataLoader.Commons.TileClient;
import backend.java.DataLoader.DatabaseClient.DBClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DataLoaderApplication {

	public static void main(String[] args) {
		SpringApplication.run(DataLoaderApplication.class, args);
		ProvinceClient.getInstance().cacheProvinces() ;
		TileClient.getInstance().cacheTiles() ;
	}

}

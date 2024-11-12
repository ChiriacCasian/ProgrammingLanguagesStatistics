package backend.java.DataLoader.API;

import backend.java.DataLoader.Commons.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://codemetrics.info"})
public class ApiService {

    private static TileClient tileClient = TileClient.getInstance() ;
    private static ProvinceClient provinceClient = ProvinceClient.getInstance() ;

    @GetMapping("/getTiles")
    public static List<Tile> getTiles(){
        return  tileClient.getByCountryCode(0) ;
    }
    @GetMapping("/getTilesUsa")
    public static List<Tile> getTilesUsa(){
        return  tileClient.getByCountryCode(2) ;
    }
    @GetMapping("/getTilesGermany")
    public static List<Tile> getTilesGermany(){
        return  tileClient.getByCountryCode(1) ;
    }



    @GetMapping("/getProvinces")
    public static List<Province> getProvinces(){
        return provinceClient.getByCountryCode(0) ;
    }
    @GetMapping("/getProvincesUsa")
    public static List<Province> getProvincesUsa(){
        return provinceClient.getByCountryCode(2) ;
    }
    @GetMapping("/getProvincesGermany")
    public static List<Province> getProvincesGermany(){
        return provinceClient.getByCountryCode(1) ;
    }
}

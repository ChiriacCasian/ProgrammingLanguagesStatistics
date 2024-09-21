import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Lang {
    int code ;
    String name ;
    int avgSalary ;
    Map<String, Integer> avgSalaryByCity ;

    public Lang(int code, String name) {
        this.code = code;
        this.name = name;
        this.avgSalary = -1;
        this.avgSalaryByCity = new HashMap<>();
    }
    public void updateAvgSalary(List<String> cities) {
        this.avgSalary = UpdateFs.update_avgSalary(code);
        for(String city : cities){
            this.avgSalaryByCity.put(city, UpdateFs.update_avgSalaryByCity(code, city));
        }
    }
    public String toString(){
        return "Lang{" +
                "code=" + code +
                ", name='" + name + '\'' +
                ", avgSalary=" + avgSalary +
                ", avgSalaryByCity=" + avgSalaryByCity +
                '}';
    }
}

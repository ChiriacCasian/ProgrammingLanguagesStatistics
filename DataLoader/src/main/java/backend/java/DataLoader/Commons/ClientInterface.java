package backend.java.DataLoader.Commons;

import java.util.List;

public interface ClientInterface<T> {
    List<T> getByCountryCode(int countryCode);
}
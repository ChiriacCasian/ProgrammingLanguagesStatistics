import java.sql.*;
import java.util.Optional;

public class UpdateFs {

    private static class DbConnection{ /// BE CAREFUL TO CALL db.endConnection() AFTER USING IT !!!
        private Connection conn ;
        private Statement statement;
        public DbConnection(Connection conn, Statement statement){
            this.conn = conn;
            this.statement = statement;
        }
        public Optional<ResultSet> getResultSet(String sqlQuery) {
            ResultSet resultSet;
            try {
                resultSet = statement.executeQuery(sqlQuery);
                return Optional.of(resultSet);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return Optional.empty();
        }
        public void endConnection() {
            try {
                if (statement != null) statement.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    private static Optional<DbConnection> connectToDb(
            String port, String database_name, String table_name, String username, String password) {

        String url = String.format("jdbc:mysql://localhost:%S/%S", port, database_name);  // Replace with your database URL
        Connection conn = null;
        Statement statement = null;
        try {
            conn = DriverManager.getConnection(url, username, password);
            statement = conn.createStatement();
            return Optional.of(new DbConnection(conn, statement));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    public static int update_avgSalary(int lang) { ///
        /// List.of("id", "lang", "assoc_lang", "city", "salary", "date", "lvl")
        try {
            DbConnection db = connectToDb("3406", "indeed_db", "jobstable", "root", "12345rita").get();
            String sqlQuery = String.format("""
            SELECT avg(salary) FROM jobstable
            WHERE lang = %d
            """, lang);
            ResultSet resultSet = db.getResultSet(sqlQuery).get();
            resultSet.next(); /// Do not forget to always position the cursor before reading the data !!
            PersistenceStateVariables.setAvgSalary(lang, resultSet.getInt(1));
            int salary = resultSet.getInt(1) ;
            db.endConnection();
            return salary ;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1 ;
    }
    public static int update_avgSalaryByCity(int lang, String city) {
        /// List.of("id", "lang", "assoc_lang", "city", "salary", "date", "lvl")
        try {
            DbConnection db = connectToDb("3406", "indeed_db", "jobstable", "root", "12345rita").get();
            String sqlQuery = String.format("""
            SELECT avg(salary) FROM jobstable
            WHERE lang = %d and city = '%s'
            """, lang, city);
            ResultSet resultSet = db.getResultSet(sqlQuery).get();
            resultSet.next(); /// Do not forget to always position the cursor before reading the data !!
            PersistenceStateVariables.setAvgSalary(lang, resultSet.getInt(1));
            int salary = resultSet.getInt(1) ;
            db.endConnection();
            return salary ;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1 ;
    }
}

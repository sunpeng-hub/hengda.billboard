package hengda.billboard;

import com.google.gson.Gson;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class UserServiceImpl extends UserGrpc.UserImplBase {

  private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  @Override
  public void signIn(UserRequest req, StreamObserver<UserReply> responseObserver) {
    logger.info("RecruitmentServiceImpl.signIn");
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select * from common_user where phone = ?";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("phone").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      if (result.size() != 0) {
        resp.put("message", "该用户已存在");
      } else {
        sql = "insert into common_user (phone,password) value (?,?)";
        ps = conn.prepareStatement(sql);
        ps.setString(1, body.get("phone").toString());
        ps.setString(2, body.get("password").toString());
        boolean i = ps.execute();
        resp.put("content", i);
      }
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    UserReply reply = UserReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void logIn(UserRequest req, StreamObserver<UserReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {

      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);

      Connection conn = DBUtil.getConn();
      String sql = "select * from common_user" + " where phone = ? and password = ?";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("phone").toString());
      ps.setString(2, body.get("password").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      if (result.size() == 0) {
        resp.put("message", "账号或密码错误");
      } else {
        Map<String, Object> userData = result.get(0);
        sql = "insert into login_journal (user_id, ip, address, category, datime) value (?,?,?,?,?)";
        ps = conn.prepareStatement(sql);
        ps.setString(1, userData.get("id").toString());
        ps.setString(2, body.get("ip").toString());
        ps.setString(3, body.get("address").toString());
        ps.setString(4, "普通用户");
        ps.setString(5, new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
        ps.execute();
        resp.put("content", userData);
      }
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    UserReply reply = UserReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void get(UserRequest req, StreamObserver<UserReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {

      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);

      Connection conn = DBUtil.getConn();
      String sql = "select * from common_user where id = ?";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("id").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      if (result.size() == 0) {
        resp.put("message", "未找到该用户");
      } else {
        resp.put("content", result.get(0));
      }
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    UserReply reply = UserReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void update(UserRequest req, StreamObserver<UserReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {

      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);

      Connection conn = DBUtil.getConn();
      String sql = "update common_user set name = ?, email=?  where id=?";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("name").toString());
      ps.setString(2, body.get("email").toString());
      ps.setString(3, body.get("id").toString());
      ps.execute();
      sql = "insert into edit_journal (user_id, category1, category2, datime) value (?,?,?,?)";
      ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("id").toString());
      ps.setString(2, "普通用户");
      ps.setString(3, "编辑用户信息");
      ps.setString(4, new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
      ps.execute();
      resp.put("content", true);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    UserReply reply = UserReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void journal(UserRequest req, StreamObserver<UserReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {

      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select * from  login_journal where user_id = ? and category = ? ORDER BY datime DESC ";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("user_id").toString());
      ps.setString(2, body.get("category").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      resp.put("content", result);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    UserReply reply = UserReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

}

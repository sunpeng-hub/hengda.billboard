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
public class MessageServiceImpl extends MessageGrpc.MessageImplBase {

  private static final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);

  @Override
  public void insert(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    logger.info("FavoriteServiceImpl.list");
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "insert into message (common_user_id, ent_user_id, content, datime, category) value (?,?,?,?,?)";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("common_user_id").toString());
      ps.setString(2, body.get("ent_user_id").toString());
      ps.setString(3, body.get("content").toString());
      ps.setString(4, new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
      ps.setString(5, body.get("category").toString());
      ps.execute();
      resp.put("content", true);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void commonContent(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select * from message where common_user_id = ? and ent_user_id = ? ORDER BY datime;";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("common_user_id").toString());
      ps.setString(2, body.get("ent_user_id").toString());
      ResultSet rs = ps.executeQuery();
      sql = "update message set status = '已读' where common_user_id = ? and ent_user_id = ? and  status = '未读' and category = 'ent_to_common'";
      ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("common_user_id").toString());
      ps.setString(2, body.get("ent_user_id").toString());
      ps.execute();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      resp.put("content", result);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void entContent(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select * from message where common_user_id = ? and ent_user_id = ? ORDER BY datime;";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("common_user_id").toString());
      ps.setString(2, body.get("ent_user_id").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      sql = "update message set status = '已读' where common_user_id = ? and ent_user_id = ? and  status = '未读' and category = 'common_to_ent'";
      ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("common_user_id").toString());
      ps.setString(2, body.get("ent_user_id").toString());
      ps.execute();
      resp.put("content", result);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void entTotal(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select count(*) as total from message where ent_user_id = ? and status = '未读' and category = 'common_to_ent'";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("id").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      resp.put("content", result.get(0).get("total"));
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void commonTotal(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select count(*) as total from message where common_user_id = ? and status = '未读' and category = 'ent_to_common'";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("id").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      resp.put("content", result.get(0).get("total"));
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void entChatTotal(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select t.*, (select count(*) from message m where"
          + " t.common_user_id=m.common_user_id and t.ent_user_id=m.ent_user_id"
          + " and  m.status = '未读' and m.category = 'common_to_ent' ) as  count"
          + " from (select distinct common_user_id, ent_user_id from message where ent_user_id = ? ) as t";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("id").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      resp.put("content", result);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void commonChatTotal(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {
      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String sql = "select t.*, (select count(*) from message m where"
          + " t.common_user_id=m.common_user_id and t.ent_user_id=m.ent_user_id"
          + " and  m.status = '未读' and m.category = 'ent_to_common' ) as  count"
          + " from (select distinct common_user_id, ent_user_id from message where common_user_id = ? ) as t";
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("id").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      resp.put("content", result);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

  @Override
  public void messageList(MessageRequest req, StreamObserver<MessageReply> responseObserver) {
    Gson gson = new Gson();
    Map<String, Object> resp = new HashMap<>();
    resp.put("message", "");
    resp.put("content", "");
    try {

      Map<String, Object> body = gson.fromJson(req.getData(), Map.class);
      Connection conn = DBUtil.getConn();
      String ent_sql = "select t2.*, username,"
          + " (select content from message m where t2.common_user_id=m.common_user_id and t2.ent_user_id=m.ent_user_id ORDER BY datime DESC limit 1) as content "
          + " from (select distinct * from (select common_user_id, ent_user_id "
          + " from message where ent_user_id = ? ORDER BY datime DESC ) as t) as t2"
          + " left join common_user on t2.common_user_id = id";
      String common_sql = "select t2.*, name,"
          + " (select content from message m where t2.common_user_id=m.common_user_id and t2.ent_user_id=m.ent_user_id ORDER BY datime DESC limit 1) as content "
          + " from (select distinct * from (select common_user_id, ent_user_id "
          + " from message where common_user_id = ? ORDER BY datime DESC ) as t) as t2"
          + " left join enterprise_user on t2.ent_user_id = id";
      String sql = "企业用户".equals(body.get("user_category").toString()) ? ent_sql : common_sql;
      PreparedStatement ps = conn.prepareStatement(sql);
      ps.setString(1, body.get("user_id").toString());
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> result = DBUtil.getList(rs);
      resp.put("content", result);
      conn.close();
    } catch (Exception e) {
      e.printStackTrace();
      resp.put("message", "gRPC服务器错误");
    }
    MessageReply reply = MessageReply.newBuilder().setData(gson.toJson(resp)).build();
    responseObserver.onNext(reply);
    responseObserver.onCompleted();
  }

}
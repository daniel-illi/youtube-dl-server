var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

function set_dismissible_message(success, message){
  message_list = "<div class=\"alert alert-" + (success ? "success" : "danger")+ " alert-dismissible fade show\" role=\"alert\">";
  message_list += "<strong>" + (success ? "Success" : "Error") + "</strong>: " + message;
  message_list += "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>";
  message_list += "</div>";
  message_list += $('#message_list').html();
  $("#message_list").html(message_list);
}

function submit_video(){
  data = {url: $("#url").val(),format: $("#format").val()};
  $.post("/api/downloads", data)
    .done(function (data) {
      set_dismissible_message(data.success, data.success ? (escapeHtml($("#url").val()) + " added to the list.") : data.error);
      $("#url").val("");
    })
    .fail(function() {
      set_dismissible_message(false, 'Could not add the url to the queue.');
  });
}

function update_queue_size(){
  $.getJSON("/api/downloads/count", function (data) {
    $("#queue_size").html(data.size);
  });
}

function purge_download_logs(){
  $.ajax({
    url: '/api/downloads',
    type: 'DELETE',
    success: function(data) {
      get_download_logs();
    }
  });
}

function get_download_logs(){
  $.getJSON("/api/downloads", function (data) {
    var download_logs = "";
    $.each(data, function(key, row) {
      download_logs += "<tr " + (row.status == 'Failed' ? "class='bg-danger'":"") + ">";
      download_logs += "<td>" + row.id + "</td>";
      download_logs += "<td>" + row.last_update + "</td>";
      download_logs += "<td>" + row.name + "</td>";
      download_logs += "<td>" + row.status + "</td>";
      download_logs += "<td style='text-align: left;'>" + row.log.replace(/\n|\r/g, '<br/>') + "</td>";
      download_logs += "</tr>";
    });
    var visible = $("td:nth-child(5)").is(":visible");
    $("#job_logs").html(download_logs);
    if (!visible) {
      hide_logs_detail();
    }
  });
}

function hide_logs_detail(){
  $('td:nth-child(5),th:nth-child(5)').hide();
}

function show_logs_detail(){
  $('td:nth-child(5),th:nth-child(5)').show();
}

function toggle_hide_logs_detail(){
  if ($("th:nth-child(5)").is(":visible")) {
    hide_logs_detail();
  }
  else {
    show_logs_detail();
  }
}

$('#url').keypress(function (e) {
  if (e.which == 13) {
    submit_video();
    update_queue_size();
    return false;
  }
});

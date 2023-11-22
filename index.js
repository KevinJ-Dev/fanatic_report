var reportmsg = "";
var reporttitle = "";
var typesreport = "Report";
var ReportListEmpty = true;
var MyReportEmpty = true;
var Report = [];
function DisplayReport(bool) {
    if (bool) {
        $('body').show(5);
        DisplayCreateReport(true);
     } else {
        $('body').hide();
        DisplayCreateReport(false)
     }
}

function MessageReport() {
    let input = document.getElementById("textreport").value
    reportmsg = input
}


function TitleReport() {
    let input = document.getElementById("reporttitle").value
    reporttitle = input
}

function TypesChange(types) {
    typesreport = types;
}
function SendReport() {
    if (reportmsg !== "" && reporttitle !== "") {
        $('#textreport').empty();
        $('#reporttitle').empty();
        $.post(`https://${GetParentResourceName()}/SendReport`, JSON.stringify({
            message: reportmsg,
            title: reporttitle,
            types: typesreport
        }));
            reportmsg = "";
            reporttitle = "";
            typesreport = "Report";
    } else {
        $.post(`https://${GetParentResourceName()}/NotCompleteReportText`, JSON.stringify({}));
    }
}

function ShowMyReport(bool) {
    if (bool) {
        $('.container-mereport').show(5)
     } else {
        $('.container-mereport').hide()
     }

}

function ShowAllReport(bool) {
    if (bool) {
        $('.container-listreport').show(5)
     } else {
        $('.container-listreport').hide()
     }
}

function DisplayCreateReport(bool) {
    if (bool) {
        $('.container-report').show(5)
        ShowAllReport(false);
        ShowMyReport(false);
        ShowNothingReportAll(false);
     } else {
        $('.container-report').hide()
     }
}

function ShowNothingReportAll(bool) {
    if (bool) {
        $('.container-listreport-nothing').show(5)
     } else {
        $('.container-listreport-nothing').hide()
     }
}

function OpenRequestReport() {
    DisplayCreateReport(true);
    ShowAllReport(false);
    ShowMyReport(false);
    ShowNothingReportAll(false);
}

function OpenMyReport() {
    DisplayCreateReport(false);
    ShowAllReport(false);
    ShowNothingReportAll(false);
    ShowMyReport(true);
    
}

function OpenListReport() {
    if (ReportListEmpty) {
        ShowAllReport(false);
        DisplayCreateReport(false);
        ShowMyReport(false);
        ShowNothingReportAll(true);
    } else {
        ShowNothingReportAll(false);
        ShowAllReport(true);
        DisplayCreateReport(false);
        ShowMyReport(false);
    }
}

function OpenListReportNothing() {
    ShowAllReport(false);
    DisplayCreateReport(false);
    ShowMyReport(false);
    ShowNothingReportAll(true);
}
function DeleteReport(reportId) {
    const index = Report.findIndex(report => report.id === reportId);

    if (index !== -1) {
        Report.splice(index, 1);

        $(`#reportListStaff tbody:eq(${index})`).remove();
        $.post(`https://${GetParentResourceName()}/DeleteReport`, JSON.stringify({
            reportId: reportId
        }));
        if (Report.length === 0) {
            ReportListEmpty = true;
            OpenListReportNothing();
        }
    } else {
        console.log(`Aucun rapport trouvé avec l'ID : ${reportId}`);
    }
}
$(document).ready(function() {
    console.log("Loaded Report 2.0");
    
    window.addEventListener("message", function(event) {
        console.log(JSON.stringify(event.data.Report));
        if (event.data.type == "openReport") {
            Report = event.data.Report;
            SetNewReportList(event.data.Report);
            SetMyReportList(event.data.Report, event.data.identifier);
            TcheckIsStaffInitMenu(event.data.isStaff);
            DisplayReport(true);
        }
    });

    function TcheckIsStaffInitMenu(isStaff) {
        if (isStaff && MyReportEmpty) {
            console.log("Staff and empty")
            $('.header-menu').empty().append(`
            <div class="menu-item" onclick="OpenRequestReport()"><i class="fa-solid fa-circle-plus" style="color: #ff0000;" ></i> DEMANDE REPPORT</div>
            <div class="menu-item" onclick="OpenListReport()"><i class="fa-solid fa-bell" style="color: #ff0000;" ></i> LISTE REPPORTS</div>`)
        } else if (isStaff && !MyReportEmpty) {
            $('.header-menu').empty().append(` <div class="menu-item" onclick="OpenMyReport()"><i class="fa-solid fa-ticket" style="color: #ff0000;"></i> MES REPPORTS</div>
            <div class="menu-item" onclick="OpenRequestReport()"><i class="fa-solid fa-circle-plus" style="color: #ff0000;" ></i> DEMANDE REPPORT</div>
            <div class="menu-item" onclick="OpenListReport()"><i class="fa-solid fa-bell" style="color: #ff0000;" ></i> LISTE REPPORTS</div>`)
        }
        if (!isStaff && MyReportEmpty) {
            $('.header-menu').empty().append(`
            <div class="menu-item" onclick="OpenRequestReport()"><i class="fa-solid fa-circle-plus" style="color: #ff0000;" ></i> DEMANDE REPPORT</div>`)
        } else if (!isStaff && !MyReportEmpty) {
            $('.header-menu').empty().append(` <div class="menu-item" onclick="OpenMyReport()"><i class="fa-solid fa-ticket" style="color: #ff0000;"></i> MES REPPORTS</div>
            <div class="menu-item" onclick="OpenRequestReport()"><i class="fa-solid fa-circle-plus" style="color: #ff0000;" ></i> DEMANDE REPPORT</div>`)
        }
    }

    function SetMyReportList(MyReport, identity) {
        if (MyReport.length > 0) {
            MyReportEmpty = false;
            MyReport.sort(function(a, b) {
                return a.id - b.id;
            });
            $('#myReportList').empty().append(`<thead>
            <tr>
              <th>TITRE</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>TEMPS</th>
              <th>VOIR</th>
            </tr>
            </thead>`)
            for (let i=0; i < MyReport.length; i++) {
                if (MyReport[i].identifier == identity) {
                    $('#myReportList').append(`<tbody>
                    <tr>
                      <td>${MyReport[i].reporttitle}</td>
                      <td>${MyReport[i].types}</td>
                      <td>${MyReport[i].status}</td>
                      <td>${MyReport[i].time}</td>
                      <td><i class="fa-solid fa-eye eyes"></i></td>
                    </tr>
                  </tbody>`)
                }
            }
        } else {
            MyReportEmpty = true;
        }
    }
    function SetNewReportList(Report) {
        if (Report.length > 0) {
            ReportListEmpty = false;
            Report.sort(function(a, b) {
                return a.id - b.id;
            });
            $('#reportListStaff').empty().append(`
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>TITRE</th>
                        <th>TYPE</th>
                        <th>STATUS</th>
                        <th>NOM</th>
                        <th>TEMPS</th>
                        <th>VOIR</th>
                        <th>SUPPRIMER</th>
                    </tr>
                </thead>`);
            
            for (let i = 0; i < Report.length; i++) {
                $('#reportListStaff').append(`
                    <tbody>
                        <tr>
                            <td>${Report[i].id}</td>
                            <td>${Report[i].reporttitle}</td>
                            <td>${Report[i].types}</td>
                            <td>${Report[i].status}</td>
                            <td>${Report[i].name}</td>
                            <td>${Report[i].time}</td>
                            <td><i class="fa-solid fa-eye eyes"></i></td>
                            <td><button class="delete-button" onclick="DeleteReport(${Report[i].id})">Supprimer</button></td>
                        </tr>
                    </tbody>`);
            }
        } else {
            ReportListEmpty = true;
            OpenListReportNothing();
        }
    }
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            DisplayReport(false)
            $.post(`https://${GetParentResourceName()}/CloseMenuReport`, JSON.stringify({}));
        }
    };
});
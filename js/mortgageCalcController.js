// Angular Controller
var app =  angular.module('MortgageCalcController',[]).filter('sortcriteria', function(chapters) {
  // ...
});

app.controller('EarlyPay', function($scope, $http){
	// Global variables
    $scope.loanAmount = 150000;
    $scope.interestRate = 4.0;
    $scope.lenghtYears;
    $scope.lengthMonths = 360;
    $scope.basicMontlyPayment = 0;
    $scope.ExtraPayment = 0;
    $scope.earlyPayElements;
    $scope.totalPayWithoutExtra = 0;
    $scope.userExtraPayment=150;

    $scope.loanTax = 0;
    $scope.propertyInsurance = 0;
    $scope.PMI = 0;
    $scope.HOA = 0;
    $scope.fixedExpenses = 0;
    $scope.includeFixExpense = true;
    $scope.chartArray = new Array();

    if(localStorage.getItem("loanAmount")){
        $scope.loanAmount = parseInt(localStorage.getItem("loanAmount"));
    }
    if(localStorage.getItem('interestRate')){
        $scope.interestRate = parseInt(localStorage.getItem('interestRate'));
    }
    if(localStorage.getItem('lenghtYears')){
        $scope.lenghtYears = parseInt(localStorage.getItem('lenghtYears'));
    }
    if(localStorage.getItem('lengthMonths')){
        $scope.lengthMonths = parseInt(localStorage.getItem('lengthMonths'));
    }
    if(localStorage.getItem('basicMontlyPayment')){
        $scope.basicMontlyPayment = parseInt(localStorage.getItem('basicMontlyPayment'));
    }
    if(localStorage.getItem('ExtraPayment')){
        $scope.ExtraPayment = parseInt(localStorage.getItem('ExtraPayment'));
    }
    if(localStorage.getItem('userExtraPayment')){
        $scope.userExtraPayment = parseInt(localStorage.getItem('userExtraPayment'));
    }
    if(localStorage.getItem('loanTax')){
        $scope.loanTax = parseInt(localStorage.getItem('loanTax'));
    }
    if(localStorage.getItem('propertyInsurance')){
        $scope.propertyInsurance = parseInt(localStorage.getItem('propertyInsurance'));
    }
    if(localStorage.getItem('PMI')){
        $scope.PMI = parseInt(localStorage.getItem('PMI'));
    }
    if(localStorage.getItem('HOA')){
        $scope.HOA = parseInt(localStorage.getItem('HOA'));
    }
    if(localStorage.getItem('fixedExpenses')){
        $scope.fixedExpenses = parseInt(localStorage.getItem('fixedExpenses'));
    }
    if(localStorage.getItem('includeFixExpense')=="false"){
        $scope.includeFixExpense = false;
    }else{
        $scope.includeFixExpense = true;
    }


    $scope.calculateMontlyPayment = function(){
        /**
        * P = (i*a)/(1-(1-i)^-360)
        **/

        if($scope.loanAmount > 0 && $scope.interestRate > 0 && $scope.lengthMonths > 0){
            $scope.basicMontlyPayment = (($scope.interestRate/100)/12) * $scope.loanAmount / (1 - Math.pow((1 + (($scope.interestRate/100)/12)), -$scope.lengthMonths));
            $scope.basicMontlyPayment = Math.round($scope.basicMontlyPayment * 100) / 100;
            localStorage.setItem("loanAmount", $scope.loanAmount);
            localStorage.setItem("interestRate", $scope.interestRate);
            localStorage.setItem("lenghtYears", $scope.lenghtYears);
            localStorage.setItem("lengthMonths", $scope.lengthMonths);
            localStorage.setItem("basicMontlyPayment", $scope.basicMontlyPayment);
            localStorage.setItem("ExtraPayment", $scope.ExtraPayment);
            localStorage.setItem("userExtraPayment", $scope.userExtraPayment);
            localStorage.setItem("loanTax", $scope.loanTax);
            localStorage.setItem("propertyInsurance", $scope.propertyInsurance);
            localStorage.setItem("PMI", $scope.PMI);
            localStorage.setItem("HOA", $scope.HOA);
            localStorage.setItem("fixedExpenses", $scope.fixedExpenses);
            localStorage.setItem("includeFixExpense", $scope.includeFixExpense);
        }
    }

    $scope.calculatePaymentTable = function(payment){

    }

    $scope.generateEarlyPayTable = function(){
        if($scope.loanAmount > 0 && $scope.interestRate > 0 && $scope.lengthMonths > 0 && $scope.lengthMonths < 480){
            $scope.calculateMontlyPayment();
            var mortageBalance = $scope.loanAmount;
            var monthlyInterest = 0;
            var additionalAmount = 0;
            var payment = $scope.basicMontlyPayment + additionalAmount;
            var interestPortion = 0;
            var totalInterestPaid = 0;
            var totalNumberOfPayments = 0;
            var totalAmountPaid = 0;
            var totalPayments = 0;
            var useUserValue = false;
            var maxPayment;
            $scope.earlyPayElements = new Array();
            $scope.earlyPayiPhone = new Array();
            $scope.chartArray = [];

            if($scope.userExtraPayment > 2000){
                maxPayment = $scope.userExtraPayment;
            }else{
                maxPayment = 2000;
            }

            while(additionalAmount <= maxPayment){
                mortageBalance = $scope.loanAmount;
                monthlyInterest = 0;
                totalInterestPaid = 0;
                if(useUserValue==true){
                    averagePayment = $scope.basicMontlyPayment + $scope.userExtraPayment;
                    payment = $scope.basicMontlyPayment + $scope.userExtraPayment;
                }else{
                    averagePayment = $scope.basicMontlyPayment + additionalAmount;
                }
                interestPortion = 0;
                totalNumberOfPayments = 0;
                totalPayments = 1;
                totalAmountPaid = 0;

                while (mortageBalance > 0) {
                    interestPortion = Math.round((mortageBalance * ($scope.interestRate/100)/12) * 100) / 100;
                    if(mortageBalance < payment){
                        interestPortion = 0;
                        payment = mortageBalance + interestPortion;
                    }else{
                        payment = averagePayment;
                    }
                    mortageBalance = mortageBalance - payment + interestPortion;
                    totalInterestPaid = totalInterestPaid + interestPortion;
                    totalAmountPaid = totalAmountPaid + payment;
                    totalPayments++;
                    if(additionalAmount == 0){
                        $scope.totalPayWithoutExtra = totalAmountPaid;
                    }
                }
                if($scope.includeFixExpense == true){
                    $scope.fixedExpenses = $scope.loanTax + $scope.propertyInsurance + $scope.PMI + $scope.HOA;
                }else{
                    $scope.fixedExpenses = 0;
                }

                if(useUserValue == true){
                    var ExtraPayment = $scope.userExtraPayment;
                }else{
                    var ExtraPayment = additionalAmount;
                }

                $scope.earlyPayElements.push({'ExtraPayment':ExtraPayment, 'MonthlyPayment':averagePayment + $scope.fixedExpenses, 'NumberOfPayments': totalPayments - 1, 'IterestPaid':totalInterestPaid, 'TotalPayment':totalAmountPaid, 'AmountSaved': $scope.totalPayWithoutExtra - totalAmountPaid});
                $scope.chartArray.push({'ExtraPayment':ExtraPayment, 'totalAmountPaid':Math.round(totalAmountPaid * 100) / 100});
                if($scope.userExtraPayment > 0 && $scope.userExtraPayment >= additionalAmount && $scope.userExtraPayment < additionalAmount + 100 && useUserValue == false){
                    $scope.earlyPayiPhone.push({'ExtraPayment':ExtraPayment, 'MonthlyPayment':averagePayment + $scope.fixedExpenses, 'NumberOfPayments': totalPayments - 1, 'IterestPaid':totalInterestPaid, 'TotalPayment':totalAmountPaid, 'AmountSaved': $scope.totalPayWithoutExtra - totalAmountPaid});
                    useUserValue = true;
                }else{
                    additionalAmount = additionalAmount + 100;
                    useUserValue = false;
                }
            }
        }
        $scope.generateChart();
    }

    $scope.generateChart = function(){
        //$('#loanChart').css({'width':'950px', 'height':'500px'});
        chartLabels = [];
        chartPlotingPoints = [];

        for (var i = 0; i < $scope.chartArray.length; i++) {
            chartLabels.push($scope.chartArray[i].ExtraPayment);
            chartPlotingPoints.push($scope.chartArray[i].totalAmountPaid);
        }

        options = {
            //animationEasing: "easeInCubic",
            scaleLineColor: "rgba(0,0,0,1)",
            scaleShowLabels: true,
            scaleLabel: "$ <%=value%>",
            scaleIntegersOnly: false,
            scaleBeginAtZero: false,
            scaleFontFamily: "'monospace",
            scaleFontSize: 12,
            scaleFontColor: "#424242",
            scaleGridLineColor: "rgba(0,0,200,0.1)",
            responsive: false,
            maintainAspectRatio: false,
            showTooltips: true,
            customTooltips: false,
            tooltipFillColor: "rgba(0,0,0,0.6)",
            tooltipFontFamily: "'monospace",
            tooltipFontSize: 12,
            tooltipTitleFontFamily: "'monospace",
            tooltipTitleFontSize: 12,
            tooltipTemplate: "$ <%= label %> Exta:  $ <%= value %>",
            scaleShowLabelBackdrop: true,
            scaleShowHorizontalLines: true,
            datasetFill: true,
            bezierCurve : false,
        }


        var chartData = {
            labels: chartLabels,
            datasets: [
                {
                    label: "Early Pay Chart",
                    fillColor: "rgba(110,225,100,0.5)",
                    strokeColor: "rgba(180,180,180,0.8)",
                    pointColor: "rgba(125,85,45,0.5)",
                    pointStrokeColor: "rgba(255,255,255,0.5)",
                    pointHighlightFill: "rgba(255,255,0,1)",
                    pointHighlightStroke: "rgba(255,255,255,1)",
                    data: chartPlotingPoints,
                }
            ]
        };

        var loanChart = document.getElementById("loanChart").getContext("2d");
        var longTermChart = new Chart(loanChart).Line(chartData, options);
    }
    $scope.generateEarlyPayTable();

    $scope.showTableData = function(){
        $('#disclosureTable').css('opacity',1);
        $('#chartWrapper').css('opacity', 0);
        $('#toogleDisplay button').show();
        $scope.showTable = true;
        $scope.showChart = false;
        localStorage.setItem("showChart", "false");
        $scope.generateChart();
        //sessionStorage.setItem('username', 'false');
    }
    $scope.showChartData = function(element){
        $('#disclosureTable').css('opacity',0);
        $('#chartWrapper').css('opacity', 1);
        $('#toogleDisplay button').show();
        $scope.showTable = false;
        $scope.showChart = true;
        localStorage.setItem("showChart", "true");
        $scope.generateChart();
        //sessionStorage.setItem('username', 'true');
    }

    $scope.convertMonthsToYears = function(){
        if($scope.lengthMonths){
            $scope.lenghtYears = $scope.lengthMonths / 12;
            if($scope.lengthMonths > 600){
              alert("The life of the loan is too long");
            }else{
              $scope.generateEarlyPayTable();
            }
        }
    }

    $scope.convertYearsToMonth = function(){
        $scope.lengthMonths = $scope.lenghtYears * 12;
        if($scope.lenghtYears > 60){
          alert("The life of the loan is too long");
        }else{
          $scope.generateEarlyPayTable();
        }
    }
    $scope.convertMonthsToYears();
    $('#loacnAmountField').select();

    if(localStorage.getItem("showChart") == "true"){
        $scope.showChartData();
    }else{
        $scope.showChart = false;
        $scope.showTable = true;
    }

	$scope.showInputSection = function(){
		$('#resultsArea').css({'z-index': '-1', 'opacity': '0'});
		$('#inputWraper').css({'z-index': '1', 'opacity': '1'});
		console.log('showInputSection');
	}

	$scope.showResultsSection = function(){
		$('#resultsArea').css({'z-index': '1', 'opacity': '1'});
		$('#inputWraper').css({'z-index': '-1', 'opacity': '0'});
		console.log("showResultsSection");
	}
});

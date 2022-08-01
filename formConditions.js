var validateDateRange = function (date, conditions) {
    var startLimit = new Date(1800, 0, 1);
    var endLimit = new Date(2100, 11, 31);
    var d = Date.parse(date);
    if (d < startLimit || d > endLimit) {
        conditions.error = "Enter a valid date";
    }
    return conditions;
};
let resultShow = "";
Bahmni.ConceptSet.FormConditions.rules = {
    'Procedure End Date': function (formName, formFieldValues) {
        var conditions = {};
        var start = formFieldValues['Procedure Start Date'];
        var end = formFieldValues['Procedure End Date'];
        if (end && start) {
            if (start > end) {
                conditions.error = "Start date should be before end date";
                return conditions;
            }
        }
        if (end) {
            if (!start) {
                conditions.error = "Please enter start date.";
            }
            return conditions;
        }
        validateDateRange(end, conditions);
        return conditions;
    },
    'Procedure Start Date': function (formName, formFieldValues) {
        var conditions = {};
        var start = formFieldValues['Procedure Start Date'];
        var end = formFieldValues['Procedure End Date'];
        if (end && start) {
            if (start > end) {
                conditions.error = "Start date should be before end date";
                return conditions;
            }
        }
        if (!start) {
            if (end) {
                conditions.error = "Start date should be before end date";
                return conditions;
            }
        }
        validateDateRange(start, conditions);
        return conditions;
    },
    'Follow up date': function (formName, formFieldValues) {
        var conditions = {};
        var followUpDate = formFieldValues['Follow up date'];
        conditions = validateDateRange(followUpDate, conditions);
        var today = new Date();
        var d = Date.parse(followUpDate);
        if (d <= today) {
            conditions.error = "Followup date must be a future date";
        }
        return conditions;
    },

};

function assignRoomFocus(form) {
    setTimeout(function () {
        $('.Select-multi-value-wrapper .Select-input input').focus();
    }, 1000);
}

function testCall(form) {
    $.ajax({
        url: "/openmrs/module/bahmnicustomutil/totalRegistration/poorPatient.form",
        success: function (result) {
            let totalPatient = result.totalPatient;
            let poorPatient = result.poorPatient;
            let percentageCount = totalPatient * 5 / 100;
            resultShow =
                'Total patient = ' + totalPatient + '\n' +
                'Poor patients registered = ' + poorPatient + '\n' +
                'Poor patients allowed = ' + percentageCount;
        }
    });
}

function freePatient(form) {
    testCall(form);
    // let feeTypeValue = form.get('Registration Fee Type').getValue();
    if (form.get('Registration Fee Type').getValue() === undefined) {
        form.get('Registration Fee Type').setValue('Paid');
    }
    if (form.get('Registration Fee Type').getValue() === 'Free') {
        form.get('Free Type').setHidden(false);
    } else {
        form.get('Free Type').setHidden(true);
    }
    if (form.get('Free Type').getValue() === 'Poor Patient') {
        form.get('Ratio of Poor Patients').setHidden(false);
        testCall(form);
        form.get('Ratio of Poor Patients').setValue(resultShow);
    } else {
        form.get('Ratio of Poor Patients').setHidden(true);
    }
}

/**
 * for Test purpose
 * @param name
 */

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}

/*function emergencyLoginCheck(form) {
    let location = decodeURIComponent(getCookie("bahmni.user.location"));
    let roomName = JSON.parse(location).name;
    if (roomName === "EMERGENCY") {
        form.get('Opd Consultation Room').setValue(22179);
        console.log(form.get('Opd Consultation Room').getValue());
    }
}*/

/**
 * Used for NITOR diseaseTemplate
 * @param form
 */
function diseaseTemplate(form) {
    //cc other option hide
    form.get('LBP cc others option').setHidden(true);
    form.get('OA cc others option').setHidden(true);
    form.get('FS cc others option').setHidden(true);
    form.get('PF cc others option').setHidden(true);
    //advice other option hide
    form.get('LBP advice others option').setHidden(true);
    form.get('OA Advice others option').setHidden(true);
    form.get('FS Advice others option').setHidden(true);
    form.get('PF advice others option').setHidden(true);
    //Disease Plan other option hide
    form.get('Disease Plan others option').setHidden(true);
    //Disease type logic
    //LBP
    if (form.get('Disease Type').getValue() === 'D LBP') {
        form.get('LBP cc').setHidden(false);
        form.get('LBP OLE').setHidden(false);
        form.get('LBP Advice').setHidden(false);
        //LBP cc other option show
        if (form.get('LBP cc').currentRecord.value.value) {
            let chiefComplainLBP = form.get('LBP cc').currentRecord.value.value;
            let ccLBPObjLength = chiefComplainLBP === undefined ? 0 : chiefComplainLBP.length;
            for (let i = 0; i < ccLBPObjLength; i++) {
                let chiefComplainLBPValue = chiefComplainLBP[i].displayString
                === undefined ? chiefComplainLBP[i].name
                    : chiefComplainLBP[i].displayString;
                if (chiefComplainLBPValue === 'LBP cc other') {
                    form.get('LBP cc others option').setHidden(false);
                } else {
                    form.get('LBP cc others option').setHidden(true);
                }
            }
        } /* else {
            // If any value is not selected of "LBP cc"
            // Note: same uuid should be used in the csv(disease template) while uploading in the server
            form.get('LBP cc').currentRecord.value.value = [
                {
                    "uuid": "04682cfd-071e-47b3-82ff-6995a0ccf667",
                    "name": "LBP Low back pain"
                },
                {
                    "uuid": "bb1e9713-95d3-4bac-a6bb-94c3d1fd7f6a",
                    "name": "LBP Low back pain radiates to both lower limb"
                },
                {
                    "uuid": "13deb58e-5936-46b2-9060-7c622d216bd7",
                    "name": "LBP Low back pain radiates to left lower limb"
                },
                {
                    "uuid": "ef5ebd53-659c-4a11-9032-af86633a1db5",
                    "name": "LBP Low back pain radiates to right lower limb"
                },
                {
                    "uuid": "9b8e6030-d306-4739-be1d-57ffa10a4ef1",
                    "name": "LBP Tingling and numbness paresthesia presen"
                },
                {"uuid": "ce74062b-8ac4-4ad1-8099-eaa1c965cb7f", "name": "LBP HO fall"},
                {
                    "uuid": "bebc385b-3ae1-4a3e-b92b-422dc9940f54",
                    "name": "LBP HO trauma"
                },
                {
                    "uuid": "6ee6eff3-0342-4e40-8993-b5a548ed5f5c",
                    "name": "LBP No HO trauma"
                }
            ];
        } */

        //LBP advice other option show
        if (form.get('LBP Advice').currentRecord.value.value) {
            let adviceLBP = form.get('LBP Advice').currentRecord.value.value;
            let adviceLBPObjLength = adviceLBP === undefined ? 0 : adviceLBP.length;
            for (let i = 0; i < adviceLBPObjLength; i++) {
                let adviceLBPValue = adviceLBP[i].displayString === undefined
                    ? adviceLBP[i].name : adviceLBP[i].displayString;
                if (adviceLBPValue === 'LBP advice others') {
                    form.get('LBP advice others option').setHidden(false);
                } else {
                    form.get('LBP advice others option').setHidden(true);
                }
            }
        } else {
            form.get('LBP Advice').currentRecord.value.value = [
                {
                    "uuid": "99fba273-6854-428d-ac4e-a9b186115016",
                    "name": "LBP Refrain from doing heavy work"
                },
                {
                    "uuid": "1f5f9bb1-c43d-4033-8833-498fe2705dda",
                    "name": "LBP Sit in the chair and pray"
                },
                {
                    "uuid": "6ff7e07d-d4bd-4eda-afb5-d279ebab8a0a",
                    "name": "LBP Do not work leaning"
                },
                {
                    "uuid": "f11cc5f6-014c-489a-8831-4501f0e4a7b3",
                    "name": "LBP Bake hot"
                },
                {
                    "uuid": "a9e47e7c-1b23-4fdf-9593-caf9d5001b56",
                    "name": "LBP Massage is prohibited"
                },
                {
                    "uuid": "3d52bceb-ee7c-4a5a-8653-c2b622fa5d86",
                    "name": "LBP se a belt around the waist"
                },
                {
                    "uuid": "3b1cee09-ce8d-4cb5-ab3d-cad782841c72",
                    "name": "LBP Use high commode"
                }
            ];

        }
    } else {
        form.get('LBP cc').setHidden(false);
        form.get('LBP OLE').setHidden(false);
        form.get('LBP Advice').setHidden(false);
    }
    //OA
    if (form.get('Disease Type').getValue() === 'D OA') {
        form.get('OA cc').setHidden(false);
        form.get('OA OLE').setHidden(false);
        form.get('OA Advice').setHidden(false);
		form.get('LBP cc').setHidden(true);
        form.get('LBP OLE').setHidden(true);
        form.get('LBP Advice').setHidden(true);
        //OA cc other option show
        if (form.get('OA cc').currentRecord.value.value) {
            let chiefComplainOA = form.get('OA cc').currentRecord.value.value;
            let ccOAObjLength = chiefComplainOA === undefined ? 0 : chiefComplainOA.length;
            for (let i = 0; i < ccOAObjLength; i++) {
                let chiefComplainOAValue = chiefComplainOA[i].displayString === undefined
                    ? chiefComplainOA[i].name : chiefComplainOA[i].displayString;
                if (chiefComplainOAValue === 'OA cc others') {
                    form.get('OA cc others option').setHidden(false);
                } else {
                    form.get('OA cc others option').setHidden(true);
                }
            }
        } /* else {
            form.get('OA cc').currentRecord.value.value = [
                {
                    "uuid": "03761d56-fe36-485a-9168-760aae803c0e",
                    "name": "OA Pain in right knee"
                },
                {
                    "uuid": "89a4ef29-b85b-4e10-8bbd-fc4a8927c380",
                    "name": "OA Pain in left knee"
                },
                {
                    "uuid": "862d3e11-ba07-4dae-9993-759f6006c5f4",
                    "name": "OA Pain in both knee"
                },
                {
                    "uuid": "46a72312-0f9d-459f-8f5e-ae1d4b678554",
                    "name": "OA Pain and swelling of knee"
                }
            ];

        } */
        //OA advice other option show
        if (form.get('OA Advice').currentRecord.value.value) {
            let adviceOA = form.get('OA Advice').currentRecord.value.value;
            let adviceOAObjLength = adviceOA === undefined ? 0 : adviceOA.length;
            for (let i = 0; i < adviceOAObjLength; i++) {
                let adviceOAValue = adviceOA[i].displayString === undefined
                    ? adviceOA[i].name : adviceOA[i].displayString;
                if (adviceOAValue === 'OA Advice others') {
                    form.get('OA Advice others option').setHidden(false);
                } else {
                    form.get('OA Advice others option').setHidden(true);
                }
            }
        } else {
            form.get('OA Advice').currentRecord.value.value = [
                {
                    "uuid": "df50eee1-020b-482c-9297-19fc6cf391b9",
                    "name": "OA Do not sit on your knees"
                },
                {
                    "uuid": "85796974-40ca-439c-90e2-b78da7549d29",
                    "name": "OA Sit in the chair and pray"
                },
                {
                    "uuid": "80c77dc2-54e6-45a2-aa5b-a63cb0ac4639",
                    "name": "OA Use a high peacock chair when cooking"
                },
                {
                    "uuid": "8dc1bdc1-56e0-4c56-9cea-60431b763e3e",
                    "name": "OA Use soft sandals"
                },
                {
                    "uuid": "4c8b80c0-200a-410d-98d4-ae0629f5ec1d",
                    "name": "OA Use high commode"
                },
                {
                    "uuid": "6eedc1aa-f502-4fc2-a817-2654a64a8e74",
                    "name": "OA When getting on stairs rickshaws or cars give less knee pain first"
                },
                {
                    "uuid": "8550e237-b461-442b-a076-8c8d21780bf4",
                    "name": "OA Use Knee cap"
                },
                {
                    "uuid": "766ce26d-a9a5-469a-a18b-ccdb480693f1",
                    "name": "OA Do not massage anything on the sore knee"
                }
            ];

        }
    } else {
        form.get('OA cc').setHidden(true);
        form.get('OA OLE').setHidden(true);
        form.get('OA Advice').setHidden(true);
    }
    //FS
    if (form.get('Disease Type').getValue() === 'D FS') {
        form.get('FS cc').setHidden(false);
        form.get('FS OLE').setHidden(false);
        form.get('FS Advice').setHidden(false);
		form.get('LBP cc').setHidden(true);
        form.get('LBP OLE').setHidden(true);
        form.get('LBP Advice').setHidden(true);
        //FS cc other option show
        if (form.get('FS cc').currentRecord.value.value) {
            let chiefComplainFS = form.get('FS cc').currentRecord.value.value;
            let ccFSObjLength = chiefComplainFS === undefined ? 0 : chiefComplainFS.length;
            for (let i = 0; i < ccFSObjLength; i++) {
                let chiefComplainFSValue = chiefComplainFS[i].displayString === undefined
                    ? chiefComplainFS[i].name : chiefComplainFS[i].displayString;
                if (chiefComplainFSValue === 'FS others') {
                    form.get('FS cc others option').setHidden(false);
                } else {
                    form.get('FS cc others option').setHidden(true);
                }
            }
        } /* else {
            form.get('FS cc').currentRecord.value.value = [
                {
                    "uuid": "3613c539-731f-42dd-8e66-e5e5686fe8ac",
                    "name": "FS Pain in right shoulder"
                },
                {
                    "uuid": "2998a36f-f406-41c7-8c2c-bc36b69890a4",
                    "name": "FS Pain in left shoulder"
                },
                {
                    "uuid": "9eb6e74a-ff5c-4945-8091-1d3dd658ef79",
                    "name": "FS Pain in both shoulder"
                }
            ];
        } */

        //FS advice other option show
        if (form.get('FS Advice').currentRecord.value.value) {
            let adviceFS = form.get('FS Advice').currentRecord.value.value;
            let adviceFSObjLength = adviceFS === undefined ? 0 : adviceFS.length;
            for (let i = 0; i < adviceFSObjLength; i++) {
                let adviceFSValue = adviceFS[i].displayString === undefined
                    ? adviceFS[i].name : adviceFS[i].displayString;
                if (adviceFSValue === 'FS Advice others') {
                    form.get('FS Advice others option').setHidden(false);
                } else {
                    form.get('FS Advice others option').setHidden(true);
                }
            }
        } else {
            form.get('FS Advice').currentRecord.value.value = [
                {"uuid": "3ad9e139-b854-4cae-a176-686962524677", "name": "FS Bake hot"},
                {
                    "uuid": "f884bd48-d7d0-452b-a832-022864f8f409",
                    "name": "FS Do the exercises taught"
                },
                {
                    "uuid": "f884bd48-d7d0-452b-a832-022864f8f409",
                    "name": "FS Do the exercises taught"
                }
            ];
        }
    } else {
        form.get('FS cc').setHidden(true);
        form.get('FS OLE').setHidden(true);
        form.get('FS Advice').setHidden(true);
    }
    //PF
    if (form.get('Disease Type').getValue() === 'D PF') {
        form.get('PF cc').setHidden(false);
        form.get('PF OLE').setHidden(false);
        form.get('PF Advice').setHidden(false);
		form.get('LBP cc').setHidden(true);
        form.get('LBP OLE').setHidden(true);
        form.get('LBP Advice').setHidden(true);
        //PF cc other option show
        if (form.get('PF cc').currentRecord.value.value) {
            let chiefComplainPF = form.get('PF cc').currentRecord.value.value;
            let ccPFObjLength = chiefComplainPF === undefined ? 0 : chiefComplainPF.length;
            for (let i = 0; i < ccPFObjLength; i++) {
                let chiefComplainPFValue = chiefComplainPF[i].displayString === undefined
                    ? chiefComplainPF[i].name : chiefComplainPF[i].displayString;
                if (chiefComplainPFValue === 'PF CC others') {
                    form.get('PF cc others option').setHidden(false);
                } else {
                    form.get('PF cc others option').setHidden(true);
                }
            }
        } /* else {
            form.get('PF cc').currentRecord.value.value = [
                {
                    "uuid": "2c12573c-e5ae-4e27-8666-d04aa2a7e186",
                    "name": "PF Pain in the right foot"
                },
                {
                    "uuid": "9ffb3080-3fdd-4049-a32c-28ad9822c570",
                    "name": "PF Pain in the left foot"
                },
                {
                    "uuid": "38d3b728-36dc-4ecf-974d-b3e485cfa5dc",
                    "name": "PF Burning sensation"
                }
            ];
        } */
        //PF advice other option show
        if (form.get('PF Advice').currentRecord.value.value) {
            let advicePF = form.get('PF Advice').currentRecord.value.value;
            let advicePFObjLength = advicePF === undefined ? 0 : advicePF.length;
            for (let i = 0; i < advicePFObjLength; i++) {
                let advicePFValue = advicePF[i].displayString === undefined
                    ? advicePF[i].name : advicePF[i].displayString;
                if (advicePFValue === 'PF Advice others') {
                    form.get('PF advice others option').setHidden(false);
                } else {
                    form.get('PF advice others option').setHidden(true);
                }
            }
        } else {
            form.get('PF Advice').currentRecord.value.value = [
                {
                    "uuid": "165a31ff-8b9f-4b0d-8410-edf82c681e57",
                    "name": "PF Use heel cushions"
                },
                {
                    "uuid": "467726f0-c8b0-4f60-9534-9096764557ad",
                    "name": "PF Wear soft shoes"
                },
                {
                    "uuid": "9a996811-ef8b-4cb5-9353-d4eac2884163",
                    "name": "PF Do not walk or stand for long periods of time"
                },
                {
                    "uuid": "8dad2db5-ea1f-47ad-9c33-3fac9f680b33",
                    "name": "PF Do not wear high heels or tight shoes"
                }
            ];
        }
    } else {
        form.get('PF cc').setHidden(true);
        form.get('PF OLE').setHidden(true);
        form.get('PF Advice').setHidden(true);
    }

    //Disease Plan other option show
    if (form.get('Disease Plan').currentRecord.value.value) {
        let diseasePlan = form.get('Disease Plan').currentRecord.value.value;
        let diseasePlanObjLength = diseasePlan === undefined ? 0
            : diseasePlan.length;
        for (let i = 0; i < diseasePlanObjLength; i++) {
            let diseasePlanValue = diseasePlan[i].displayString === undefined
                ? diseasePlan[i].name : diseasePlan[i].displayString;
            if (diseasePlanValue === 'Disease Plan Others') {
                form.get('Disease Plan others option').setHidden(false);
            } else {
                form.get('Disease Plan others option').setHidden(true);
            }
        }
    } /* else {
        form.get('Disease Plan').currentRecord.value.value = [
            {
                "uuid": "3fbf309a-1bbb-41d6-b542-7b854f55be2f",
                "name": "Disease Plan Physiotherapy"
            },
            {
                "uuid": "a858be8a-681b-4547-afe4-6eaffc51af9b",
                "name": "Disease Plan Conservative"
            },
            {
                "uuid": "91b33711-5e26-4e29-8e01-99cc34833c63",
                "name": "Disease Plan Surgical"
            }
        ];
    } */
}

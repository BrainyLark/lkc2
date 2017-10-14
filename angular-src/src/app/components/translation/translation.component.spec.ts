/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TranslationComponent } from './translation.component';

describe('TranslationComponent', () => {
  let component: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


var app = angular.module("app",[]);

app.controller("MyCtrl" , function($scope){

   $scope.data ={
       names:[{ name:""}]
   };

  $scope.addRow = function(index){
    var name = {name:""};
       if($scope.data.names.length <= index+1){
            $scope.data.names.splice(index+1,0,name);
        }
    };

  $scope.deleteRow = function($event,name){
  var index = $scope.data.names.indexOf(name);
    if($event.which == 1)
       $scope.data.names.splice(index,1);
    }

  });

import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EditorComponent, ErrorMark } from '../editor/editor.component';
import { OCAService } from '../services/oca/oca.service';
import { DataService } from '../services/data/data.service';
import { FormsModule } from '@angular/forms';
import { Renderer, getRenderer, getRendererSelectionOptions } from '../renderer';
import { NgFor } from '@angular/common';
import { JsonObject, OCABundle } from '../model';
import { ErrorComponent } from '../renderer/error/error.component';
import { OCAValidationError, validateOCABundle } from '../validator/bundle';
import { LanguageSelectionComponent } from '../renderer/language-selection/language-selection.component';
import { AngularSplitModule, SplitComponent } from 'angular-split';

@Component({
  selector: 'app-playground',
  host: {
    class: 'h-full'
  },
  standalone: true,
  imports: [FormsModule, EditorComponent, NgFor, LanguageSelectionComponent, AngularSplitModule],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css'
})
export class PlaygroundComponent implements AfterViewInit {
  // Internal properties
  inputModel!: JsonObject;
  inputUserModifications!: JsonObject;
  inputError: string | undefined;

  ocaModel!: OCABundle;
  ocaUserModifications!: OCABundle;
  ocaError: string | undefined;
  ocaErrorMark: ErrorMark | undefined;

  // Fields
  get rendererSelectionOptions() {
    return getRendererSelectionOptions();
  }

  get examples() {
    return this.dataService.getExamples();
  }

  loadExampleState = '';
  viewRenderSelection = Renderer.PREVIEW;
  @ViewChild('viewRenderComponent', { read: ViewContainerRef }) viewRenderComponent:
    | ViewContainerRef
    | undefined;

  @ViewChild('split') split: SplitComponent | undefined;
  @ViewChild('inputEditor') inputEditor: EditorComponent | undefined;
  @ViewChild('ocaEditor') ocaEditor: EditorComponent | undefined;
  ngAfterViewInit() {
    this.split?.dragProgress$.subscribe(() => {
      this.inputEditor?.updateLayout();
      this.ocaEditor?.updateLayout();
    });
  }

  constructor(
    private ocaService: OCAService,
    private dataService: DataService
  ) {
    this.reset();
  }

  language = 'en';
  onLanguage(value: string) {
    this.language = value;
    this.updateViewRenderer();
  }

  onInputChanged(value: JsonObject) {
    this.inputError = undefined;
    this.inputUserModifications = value;
    this.updateViewRenderer();
  }

  onInputError(value: string) {
    this.inputError = value;
    this.updateViewRenderer();
  }

  onOCAChanged(value: JsonObject) {
    this.ocaError = undefined;
    this.ocaErrorMark = undefined;
    this.ocaUserModifications = value as OCABundle;

    validateOCABundle(value)
      .catch((e) => {
        if (e instanceof OCAValidationError) {
          this.ocaErrorMark = e;
        }
        this.ocaError = `Bundle validation: ${e instanceof Error ? e.message : e}`;
      })
      .finally(() => this.updateViewRenderer());
  }

  onOCAError(value: string) {
    this.ocaError = value;
    this.updateViewRenderer();
  }

  loadExample(event: Event) {
    const example = this.examples.find((example) => example.id === this.loadExampleState);

    if (example) {
      this.inputModel = example.input;
      this.inputUserModifications = example.input;
      this.ocaModel = example.oca;
      this.ocaUserModifications = example.oca;
    }
  }

  updateViewRenderer(event?: Event) {
    this.viewRenderComponent?.clear();

    if (this.inputError || this.ocaError) {
      const viewComponent = this.viewRenderComponent?.createComponent(ErrorComponent);
      viewComponent?.setInput('title', this.inputError ? 'Input Error' : 'OCA Error');
      viewComponent?.setInput('description', this.inputError || this.ocaError);
      return;
    }

    const viewComponent = this.viewRenderComponent?.createComponent(
      getRenderer(this.viewRenderSelection)
    );

    viewComponent?.setInput('input', this.inputUserModifications);
    viewComponent?.setInput('oca', this.ocaUserModifications);
    viewComponent?.setInput('language', this.language);
  }

  reset(event?: Event) {
    this.ocaModel = this.ocaService.initOCA();
    this.ocaUserModifications = this.ocaModel;
    this.inputModel = {};
    this.inputUserModifications = this.inputModel;
    this.loadExampleState = '';
    this.language = 'en';
    this.viewRenderComponent?.clear();
  }

  addCaptureBase(event: Event) {
    this.ocaModel = this.ocaService.addCaptureBase(this.ocaUserModifications);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.ocaModel = await this.ocaService.computeDigests(this.ocaUserModifications);
  }
}

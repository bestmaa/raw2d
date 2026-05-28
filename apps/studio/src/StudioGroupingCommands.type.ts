import type { StudioCommand, StudioCommandApplyOptions } from "./StudioCommand.type";

export interface StudioGroupingCommandResult {
  readonly command: StudioCommand;
  readonly options: StudioCommandApplyOptions;
}

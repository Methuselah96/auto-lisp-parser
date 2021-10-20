/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * A position in the editor. This interface is suitable for serialization.
 */
export interface IPosition {
  /**
   * line number (starts at 1)
   */
  readonly lineNumber: number;
  /**
   * column (the first character in a line is between column 1 and column 2)
   */
  readonly column: number;
}

/**
 * A position in the editor.
 */
export class Position {
  /**
   * line number (starts at 1)
   */
  public readonly lineNumber: number;
  /**
   * column (the first character in a line is between column 1 and column 2)
   */
  public readonly column: number;

  constructor(lineNumber: number, column: number) {
    this.lineNumber = lineNumber;
    this.column = column;
  }

  /**
   * Convert to a human-readable representation.
   */
  public toString(): string {
    return "(" + this.lineNumber + "," + this.column + ")";
  }
}

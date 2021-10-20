/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPosition, Position } from "./position";

/**
 * A range in the editor. This interface is suitable for serialization.
 */
export interface IRange {
  /**
   * Line number on which the range starts (starts at 1).
   */
  readonly startLineNumber: number;
  /**
   * Column on which the range starts in line `startLineNumber` (starts at 1).
   */
  readonly startColumn: number;
  /**
   * Line number on which the range ends.
   */
  readonly endLineNumber: number;
  /**
   * Column on which the range ends in line `endLineNumber`.
   */
  readonly endColumn: number;
}

/**
 * A range in the editor. (startLineNumber,startColumn) is <= (endLineNumber,endColumn)
 */
export class Range {
  /**
   * Line number on which the range starts (starts at 1).
   */
  public readonly startLineNumber: number;
  /**
   * Column on which the range starts in line `startLineNumber` (starts at 1).
   */
  public readonly startColumn: number;
  /**
   * Line number on which the range ends.
   */
  public readonly endLineNumber: number;
  /**
   * Column on which the range ends in line `endLineNumber`.
   */
  public readonly endColumn: number;

  constructor(
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number
  ) {
    if (
      startLineNumber > endLineNumber ||
      (startLineNumber === endLineNumber && startColumn > endColumn)
    ) {
      this.startLineNumber = endLineNumber;
      this.startColumn = endColumn;
      this.endLineNumber = startLineNumber;
      this.endColumn = startColumn;
    } else {
      this.startLineNumber = startLineNumber;
      this.startColumn = startColumn;
      this.endLineNumber = endLineNumber;
      this.endColumn = endColumn;
    }
  }

  /**
   * Test if position is in this range. If the position is at the edges, will return true.
   */
  public containsPosition(position: IPosition): boolean {
    return Range.containsPosition(this, position);
  }

  /**
   * Test if `position` is in `range`. If the position is at the edges, will return true.
   */
  public static containsPosition(range: IRange, position: IPosition): boolean {
    if (
      position.lineNumber < range.startLineNumber ||
      position.lineNumber > range.endLineNumber
    ) {
      return false;
    }
    if (
      position.lineNumber === range.startLineNumber &&
      position.column < range.startColumn
    ) {
      return false;
    }
    if (
      position.lineNumber === range.endLineNumber &&
      position.column > range.endColumn
    ) {
      return false;
    }
    return true;
  }

  /**
   * Return the end position (which will be after or equal to the start position)
   */
  public getEndPosition(): Position {
    return Range.getEndPosition(this);
  }

  /**
   * Return the end position (which will be after or equal to the start position)
   */
  public static getEndPosition(range: IRange): Position {
    return new Position(range.endLineNumber, range.endColumn);
  }

  /**
   * Return the start position (which will be before or equal to the end position)
   */
  public getStartPosition(): Position {
    return Range.getStartPosition(this);
  }

  /**
   * Return the start position (which will be before or equal to the end position)
   */
  public static getStartPosition(range: IRange): Position {
    return new Position(range.startLineNumber, range.startColumn);
  }

  /**
   * Transform to a user presentable string representation.
   */
  public toString(): string {
    return (
      "[" +
      this.startLineNumber +
      "," +
      this.startColumn +
      " -> " +
      this.endLineNumber +
      "," +
      this.endColumn +
      "]"
    );
  }

  public static fromPositions(start: IPosition, end: IPosition = start): Range {
    return new Range(
      start.lineNumber,
      start.column,
      end.lineNumber,
      end.column
    );
  }
}

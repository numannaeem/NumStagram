import React from "react";
import {
  Placeholder,
  Divider,
  List,
  Button,
  Card,
  Container,
  Icon
} from "semantic-ui-react";
import { range } from "lodash";

export const PlaceHolderPosts = () =>
  range(1, 3).map(item => (
    <div key={item}>
      <Placeholder fluid>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      <Divider hidden />
    </div>
  ));

export const PlaceHolderSuggestions = () => (
  <>
    <List.Item>
      <Card color="red">
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
          </Placeholder>
        </Card.Content>

        <Card.Content extra>
          <Button
            disabled
            circular
            size="small"
            icon="add user"
            content="Follow"
            color="twitter"
          />
        </Card.Content>
      </Card>
    </List.Item>
  </>
);

export const PlaceHolderNotifications = () =>
  range(1, 10).map(item => (
    <div key={item}>
      <Placeholder>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
      <Divider hidden />
    </div>
  ));

export const EndMessage = () => (
  <Container textAlign="center">
    <Icon name="check circle outline" size="large" />
    <p>You're all caught up!</p>
  </Container>
);

export const LikesPlaceHolder = () =>
  range(1, 6).map(item => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));

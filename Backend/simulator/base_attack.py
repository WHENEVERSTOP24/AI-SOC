from abc import ABC, abstractmethod


class BaseAttack(ABC):

    @abstractmethod
    def execute(self):
        pass

    @abstractmethod
    def name(self):
        pass

    @abstractmethod
    def description(self):
        pass